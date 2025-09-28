<?php
// Règle métier IN/OUT + stock courant via somme des mouvements
namespace Wits\Services;

use Illuminate\Database\Capsule\Manager as DB;
use Wits\Models\Movement;

final class MovementService
{
    /** Retourne le stock courant par somme des mouvements. */
    public function currentStock(int $productId): int
    {
        $s = DB::table('movements')
            ->selectRaw("COALESCE(SUM(CASE WHEN movement_type='IN' THEN movement_quantity
                                           WHEN movement_type='OUT' THEN -movement_quantity
                                           ELSE 0 END),0) AS s")
            ->where('product_id', $productId)
            ->value('s');
        return (int)($s ?? 0);
    }

    /** Règle simple testable : OUT ne doit pas dépasser stock. */
    public static function ensureOutAllowed(int $stock, int $outQty): void
    {
        if ($outQty <= 0) throw new \DomainException('quantity_must_be_positive');
        if ($outQty > $stock) throw new \DomainException('out_exceeds_stock');
    }

    /** Enregistre un mouvement avec transaction + règle OUT ≤ stock. */
    public function record(string $type, int $productId, int $qty, ?string $note): array
    {
        $type = strtoupper(trim($type));
        if (!in_array($type, ['IN','OUT'], true)) {
            throw new \DomainException('invalid_type');
        }
        if ($qty <= 0) throw new \DomainException('quantity_must_be_positive');

        return DB::connection()->transaction(function () use ($type, $productId, $qty, $note) {
            $stock = $this->currentStock($productId);
            if ($type === 'OUT') {
                self::ensureOutAllowed($stock, $qty);
            }

            $m = Movement::create([
                'product_id' => $productId,
                'movement_type' => $type,
                'movement_quantity' => $qty,
                'movement_note' => $note
            ]);

            $newStock = $stock + ($type === 'IN' ? $qty : -$qty);

            return [
                'movement_id' => $m->movement_id,
                'product_id'  => $productId,
                'type'        => $type,
                'quantity'    => $qty,
                'stock'       => $newStock
            ];
        });
    }
}
