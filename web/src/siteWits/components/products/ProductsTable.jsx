import React, { useMemo } from "react";

/**
 * Applique les filtres côté client avant affichage.
 * @param {Array} rows - Liste brute des produits
 * @param {Object} f - Ensemble des filtres actifs
 */
function applyFilters(rows, f) {
    if (!rows || !Array.isArray(rows)) return [];
    if (!f) return rows;

    let out = rows;

    // Recherche textuelle
    const kw = (f.keyword || "").trim().toLowerCase();
    if (kw) {
        out = out.filter((r) =>
            [r.product_name, r.product_sku, r.product_brand, r.category_name, r.product_description]
                .filter(Boolean)
                .some((v) => String(v).toLowerCase().includes(kw))
        );
    }

    // Filtrage par stock
    const sMin = f.stockMin === "" ? null : Number(f.stockMin);
    const sMax = f.stockMax === "" ? null : Number(f.stockMax);
    out = out.filter((r) => {
        const stock = r.current_stock ?? r.stock ?? 0;
        const okMin = sMin === null || stock >= sMin;
        const okMax = sMax === null || stock <= sMax;
        return okMin && okMax;
    });

    return out;
}

/**
 * Table des produits
 * @param {Array} data - Liste complète des produits
 * @param {Function} onSelect - Callback quand on clique sur un produit
 * @param {number} selectedId - ID du produit sélectionné
 */
export default function ProductsTable({ data, filters, selectedId, onSelect }) {
    const rows = useMemo(() => applyFilters(data, filters), [data, filters]);

    return (
        <section className="card products-table">
            <header className="card__header">
                <h2>Produits</h2>
                <div className="products-table__meta">
                    <span>{rows.length} résultat(s)</span>
                    <span className="spacer" />
                </div>
            </header>

            <div className="table-wrapper">
                <table>
                    <thead>
                    <tr>
                        <th style={{ width: 64 }}>ID</th>
                        <th>Nom</th>
                        <th>Marque</th>
                        <th style={{ width: 120 }}>Prix</th>
                        <th style={{ width: 120 }}>Catégorie</th>
                        <th style={{ width: 100 }}>Stock</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows.map((r) => {
                        const isSelected = r.product_id === selectedId;
                        return (
                            <tr
                                key={r.product_id}
                                className={isSelected ? "is-selected" : ""}
                                onClick={() => onSelect?.(r)}
                            >
                                <td>{r.product_id}</td>
                                <td className="cell-ellipsis">{r.product_name}</td>
                                <td className="cell-ellipsis">{r.product_brand || "-"}</td>
                                <td>
                                    {Number.isFinite(Number(r.product_price))
                                        ? Number(r.product_price).toFixed(2) + " €"
                                        : "-"}
                                </td>
                                <td>{r.category_name || "-"}</td>
                                <td>
                                    {Number.isFinite(Number(r.current_stock))
                                        ? r.current_stock
                                        : "-"}
                                </td>
                            </tr>
                        );
                    })}

                    {rows.length === 0 && (
                        <tr>
                            <td colSpan={6} style={{ opacity: 0.7, padding: 16 }}>
                                Aucun produit ne correspond aux filtres.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
