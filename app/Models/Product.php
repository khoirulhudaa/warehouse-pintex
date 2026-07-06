<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'sku', 'name', 'category_id', 'supplier_id',
        'unit', 'price', 'min_stock', 'description',
    ];

    protected $casts = [
        'price' => 'integer',
        'min_stock' => 'integer',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function warehouses(): BelongsToMany
    {
        return $this->belongsToMany(Warehouse::class)
            ->withPivot('quantity')
            ->withTimestamps();
    }

    public function stockMovements(): HasMany
    {
        return $this->hasMany(StockMovement::class);
    }

    public function totalStock(): int
    {
        return (int) $this->warehouses()->sum('product_warehouse.quantity');
    }

    public function isLowStock(): bool
    {
        return $this->totalStock() <= $this->min_stock;
    }
}
