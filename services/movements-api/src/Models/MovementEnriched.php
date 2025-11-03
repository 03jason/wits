<?php
declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MovementEnriched extends Model
{
    /** Vue SQL (lecture seule) */
    protected $table = 'v_movements_enriched';

    /** Clé primaire non auto-incrémentée (vue) */
    protected $primaryKey = 'movement_id';
    public $incrementing = false;
    public $timestamps   = false;

    /** Colonnes exposées */
    protected $fillable = [
        'movement_id',
        'product_id',
        'product_name',
        'quantity',
        'user_name',
        'type_code',
        'type_label',
        'note',
        'created_at',
    ];

    /** Casts utiles pour l’API */
    protected $casts = [
        'movement_id' => 'integer',
        'product_id'  => 'integer',
        'quantity'    => 'integer',
        'created_at'  => 'datetime:Y-m-d H:i:s',
    ];
}
