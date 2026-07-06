<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\StockMovementController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\WarehouseController;
use Illuminate\Support\Facades\Route;

Route::get('/', fn () => redirect()->route('dashboard'));

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('categories', CategoryController::class)
        ->except(['create', 'edit', 'show'])
        ->names('categories');

    Route::resource('suppliers', SupplierController::class)
        ->except(['create', 'edit', 'show'])
        ->names('suppliers');

    Route::resource('warehouses', WarehouseController::class)
        ->except(['create', 'edit', 'show'])
        ->names('warehouses');

    Route::resource('products', ProductController::class)
        ->except(['create', 'edit'])
        ->names('products');

    Route::get('stock-movements', [StockMovementController::class, 'index'])->name('stock-movements.index');
    Route::post('stock-movements', [StockMovementController::class, 'store'])->name('stock-movements.store');
    Route::delete('stock-movements/{stockMovement}', [StockMovementController::class, 'destroy'])->name('stock-movements.destroy');
});

require __DIR__.'/auth.php';
