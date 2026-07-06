<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockMovement extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id', 'warehouse_id', 'user_id',
        'type', 'quantity', 'reference', 'note',
    ];

    protected $casts = [
        'quantity' => 'integer',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    /**
     * Signed quantity effect on stock: 'in' & positive 'adjustment' add,
     * 'out' subtracts.
     */
    public function delta(): int
    {
        return $this->type === 'out' ? -abs($this->quantity) : abs($this->quantity);
    }
}
