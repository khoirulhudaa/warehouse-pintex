<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\Supplier;
use App\Models\Warehouse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();

        $products = Product::with(['category:id,name', 'supplier:id,name', 'warehouses'])
            ->when($search, fn ($q) => $q->where('name', 'like', "%{$search}%")
                ->orWhere('sku', 'like', "%{$search}%"))
            ->orderBy('name')
            ->get()
            ->map(fn (Product $p) => [
                'id' => $p->id,
                'sku' => $p->sku,
                'name' => $p->name,
                'unit' => $p->unit,
                'price' => $p->price,
                'min_stock' => $p->min_stock,
                'total_stock' => $p->totalStock(),
                'is_low_stock' => $p->isLowStock(),
                'category' => $p->category,
                'supplier' => $p->supplier,
            ]);

        return Inertia::render('Products/Index', [
            'products' => $products,
            'categories' => Category::orderBy('name')->get(['id', 'name']),
            'suppliers' => Supplier::orderBy('name')->get(['id', 'name']),
            'filters' => ['search' => $search],
        ]);
    }

    public function show(Product $product): Response
    {
        $product->load(['category', 'supplier', 'warehouses', 'stockMovements' => function ($q) {
            $q->with(['warehouse:id,name', 'user:id,name'])->latest()->limit(20);
        }]);

        return Inertia::render('Products/Show', [
            'product' => [
                'id' => $product->id,
                'sku' => $product->sku,
                'name' => $product->name,
                'unit' => $product->unit,
                'price' => $product->price,
                'min_stock' => $product->min_stock,
                'description' => $product->description,
                'total_stock' => $product->totalStock(),
                'category' => $product->category,
                'supplier' => $product->supplier,
                'warehouses' => $product->warehouses->map(fn ($w) => [
                    'id' => $w->id,
                    'name' => $w->name,
                    'code' => $w->code,
                    'quantity' => $w->pivot->quantity,
                ]),
                'movements' => $product->stockMovements,
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'sku' => 'required|string|max:100|unique:products,sku',
            'name' => 'required|string|max:255',
            'category_id' => 'nullable|exists:categories,id',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'unit' => 'required|string|max:50',
            'price' => 'required|integer|min:0',
            'min_stock' => 'required|integer|min:0',
            'description' => 'nullable|string',
        ]);

        Product::create($data);

        return back()->with('success', 'Produk berhasil ditambahkan.');
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $data = $request->validate([
            'sku' => 'required|string|max:100|unique:products,sku,'.$product->id,
            'name' => 'required|string|max:255',
            'category_id' => 'nullable|exists:categories,id',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'unit' => 'required|string|max:50',
            'price' => 'required|integer|min:0',
            'min_stock' => 'required|integer|min:0',
            'description' => 'nullable|string',
        ]);

        $product->update($data);

        return back()->with('success', 'Produk berhasil diperbarui.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $product->delete();

        return back()->with('success', 'Produk berhasil dihapus.');
    }
}
