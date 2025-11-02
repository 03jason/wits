<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** Vue SQL v_movements_enriched */
class MovementEnriched extends Model
{
    protected $table = 'v_movements_enriched';
    protected $primaryKey = 'movements_id';
    public $incrementing = false;
    public $timestamps = false;
    protected $guarded = [];
}
