<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table = 'products';
    protected $primaryKey = 'product_id';
    public $timestamps = false;

    protected $fillable = [
        'product_sku','product_name','product_brand','product_price',
        'category_id','product_description','location_id',
        'product_min_threshold','product_active'
    ];
}
