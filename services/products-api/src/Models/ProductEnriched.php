<?php
// Vue SQL: v_products_enriched (read-only)
namespace Wits\Models;

use Illuminate\Database\Eloquent\Model;

class ProductEnriched extends Model
{
    protected $table = 'v_products_enriched';
    protected $primaryKey = 'product_id';
    public $timestamps = false; // vue: pas de created_at/updated_at
    protected $guarded = [];
    protected $casts = [
        'current_stock' => 'int',
        'is_below_threshold' => 'int',
        'product_price' => 'float'
    ];
}
