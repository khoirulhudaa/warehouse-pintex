<?php

namespace App\Http\Controllers;

use App\Models\Warehouse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WarehouseController extends Controller
{
    public function index(): Response
    {
        $warehouses = Warehouse::withCount('products')
            ->orderBy('name')
            ->get()
            ->map(fn (Warehouse $w) => [
                'id' => $w->id,
                'code' => $w->code,
                'name' => $w->name,
                'location' => $w->location,
                'products_count' => $w->products_count,
                'total_stock' => $w->totalStock(),
            ]);

        return Inertia::render('Warehouses/Index', [
            'warehouses' => $warehouses,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'code' => 'required|string|max:50|unique:warehouses,code',
            'name' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
        ]);

        Warehouse::create($data);

        return back()->with('success', 'Gudang berhasil ditambahkan.');
    }

    public function update(Request $request, Warehouse $warehouse): RedirectResponse
    {
        $data = $request->validate([
            'code' => 'required|string|max:50|unique:warehouses,code,'.$warehouse->id,
            'name' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
        ]);

        $warehouse->update($data);

        return back()->with('success', 'Gudang berhasil diperbarui.');
    }

    public function destroy(Warehouse $warehouse): RedirectResponse
    {
        $warehouse->delete();

        return back()->with('success', 'Gudang berhasil dihapus.');
    }
}
