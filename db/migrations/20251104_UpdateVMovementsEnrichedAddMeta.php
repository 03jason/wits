<?php
declare(strict_types=1);

use Phinx\Migration\AbstractMigration;

final class UpdateVMovementsEnrichedAddMeta extends AbstractMigration
{
    public function up(): void
    {
        $this->execute("
            CREATE OR REPLACE VIEW v_movements_enriched AS
            SELECT
                m.movement_id       AS movement_id,
                m.product_id        AS product_id,
                p.product_name      AS product_name,
                m.quantity          AS quantity,
                CONCAT(u.first_name, ' ', u.last_name) AS user_name,
                m.type_code         AS type_code,
                mt.type_label       AS type_label,
                m.note              AS note,
                m.created_at        AS created_at,
                m.meta_before       AS meta_before,
                m.meta_after        AS meta_after
            FROM movements m
            LEFT JOIN products p        ON p.product_id = m.product_id
            LEFT JOIN users u           ON u.user_id = m.user_id
            LEFT JOIN movement_types mt ON mt.type_code = m.type_code;
        ");
    }

    public function down(): void
    {
        // Version 'sans meta' si tu veux revert
        $this->execute("
            CREATE OR REPLACE VIEW v_movements_enriched AS
            SELECT
                m.movement_id       AS movement_id,
                m.product_id        AS product_id,
                p.product_name      AS product_name,
                m.quantity          AS quantity,
                CONCAT(u.first_name, ' ', u.last_name) AS user_name,
                m.type_code         AS type_code,
                mt.type_label       AS type_label,
                m.note              AS note,
                m.created_at        AS created_at
            FROM movements m
            LEFT JOIN products p        ON p.product_id = m.product_id
            LEFT JOIN users u           ON u.user_id = m.user_id
            LEFT JOIN movement_types mt ON mt.type_code = m.type_code;
        ");
    }
}
