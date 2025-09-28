<?php
// Modèle Eloquent : table movements
namespace Wits\Models;

use Illuminate\Database\Eloquent\Model;

class Movement extends Model
{
    protected $table = 'movements';
    protected $primaryKey = 'movement_id';
    public $timestamps = false; // movement_at géré côté DB
    protected $fillable = [
        'product_id','movement_type','movement_quantity','movement_at','movement_note'
    ];
    protected $casts = [
        'product_id' => 'int',
        'movement_quantity' => 'int',
    ];
}
