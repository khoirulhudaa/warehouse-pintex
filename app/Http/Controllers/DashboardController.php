<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\StockMovement;
use App\Models\Warehouse;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $products = Product::with('warehouses')->get();

        $totalStock = $products->sum(fn (Product $p) => $p->totalStock());
        $lowStock = $products->filter(fn (Product $p) => $p->isLowStock())->values();

        $recentMovements = StockMovement::with(['product:id,name,sku', 'warehouse:id,name', 'user:id,name'])
            ->latest()
            ->limit(8)
            ->get();

        $warehouseBreakdown = Warehouse::withCount('products')
            ->get()
            ->map(fn (Warehouse $w) => [
                'id' => $w->id,
                'name' => $w->name,
                'code' => $w->code,
                'total_stock' => $w->totalStock(),
                'product_count' => $w->products_count,
            ]);

        return Inertia::render('Dashboard/Index', [
            'stats' => [
                'total_products' => $products->count(),
                'total_stock' => $totalStock,
                'total_warehouses' => Warehouse::count(),
                'low_stock_count' => $lowStock->count(),
            ],
            'lowStock' => $lowStock->take(6)->map(fn (Product $p) => [
                'id' => $p->id,
                'name' => $p->name,
                'sku' => $p->sku,
                'stock' => $p->totalStock(),
                'min_stock' => $p->min_stock,
            ])->values(),
            'recentMovements' => $recentMovements,
            'warehouseBreakdown' => $warehouseBreakdown,
        ]);
    }
}
