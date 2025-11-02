<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Movement extends Model
{
    protected $table = 'movements';
    protected $primaryKey = 'movement_id';
    public $timestamps = false;

    protected $fillable = [
        'product_id','type_code','quantity','note',
        'resulting_stock','meta_before','meta_after','created_at'
    ];

    protected $casts = [
        'meta_before' => 'array',
        'meta_after'  => 'array',
    ];
}
