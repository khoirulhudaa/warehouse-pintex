<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\StockMovement;
use App\Models\Warehouse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class StockMovementController extends Controller
{
    public function index(Request $request): Response
    {
        $movements = StockMovement::with(['product:id,name,sku', 'warehouse:id,name', 'user:id,name'])
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('StockMovements/Index', [
            'movements' => $movements,
            'products' => Product::orderBy('name')->get(['id', 'name', 'sku', 'unit']),
            'warehouses' => Warehouse::orderBy('name')->get(['id', 'name', 'code']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'product_id' => 'required|exists:products,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'type' => 'required|in:in,out,adjustment',
            'quantity' => 'required|integer|min:1',
            'reference' => 'nullable|string|max:255',
            'note' => 'nullable|string',
        ]);

        DB::transaction(function () use ($data, $request) {
            $product = Product::findOrFail($data['product_id']);
            $warehouse = Warehouse::findOrFail($data['warehouse_id']);

            $pivot = $product->warehouses()->where('warehouse_id', $warehouse->id)->first();
            $currentQty = $pivot?->pivot->quantity ?? 0;

            $delta = $data['type'] === 'out' ? -abs($data['quantity']) : abs($data['quantity']);
            $newQty = $currentQty + $delta;

            if ($newQty < 0) {
                throw ValidationException::withMessages([
                    'quantity' => "Stok tidak cukup. Stok tersedia di {$warehouse->name}: {$currentQty}.",
                ]);
            }

            $product->warehouses()->syncWithoutDetaching([
                $warehouse->id => ['quantity' => $newQty],
            ]);

            StockMovement::create([
                ...$data,
                'user_id' => $request->user()?->id,
            ]);
        });

        return back()->with('success', 'Pergerakan stok berhasil dicatat.');
    }

    public function destroy(StockMovement $stockMovement): RedirectResponse
    {
        DB::transaction(function () use ($stockMovement) {
            $product = $stockMovement->product;
            $pivot = $product->warehouses()->where('warehouse_id', $stockMovement->warehouse_id)->first();
            $currentQty = $pivot?->pivot->quantity ?? 0;

            // Reverse the movement's effect on stock.
            $reversedQty = $currentQty - $stockMovement->delta();

            $product->warehouses()->syncWithoutDetaching([
                $stockMovement->warehouse_id => ['quantity' => max(0, $reversedQty)],
            ]);

            $stockMovement->delete();
        });

        return back()->with('success', 'Pergerakan stok dihapus & stok disesuaikan kembali.');
    }
}
