<?php
// Modèle Eloquent : table products
namespace Wits\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table = 'products';
    protected $primaryKey = 'product_id';
    public $timestamps = true; // si colonnes created_at/updated_at existent
    protected $fillable = [
        'product_sku','product_name','product_brand','product_price',
        'product_category','product_description','product_location',
        'product_min_threshold','product_active'
    ];
    protected $casts = [
        'product_price' => 'float',
        'product_min_threshold' => 'int',
        'product_active' => 'bool',
    ];
}
