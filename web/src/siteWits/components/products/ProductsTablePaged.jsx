// web/src/siteWits/components/products/ProductsTablePaged.jsx
import React, { useMemo, useState } from "react";

export default function ProductsTablePaged({
                                               rows = [],
                                               pageSize = 10,
                                               totalCount,          // optionnel : si tu as le total serveur (sinon rows.length)
                                           }) {
    const [page, setPage] = useState(1);
    const total = totalCount ?? rows.length;
    const pageCount = Math.max(1, Math.ceil(total / pageSize));

    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, total);
    const displayRows = useMemo(
        () => rows.slice(startIndex, endIndex),
        [rows, startIndex, endIndex]
    );

    const goTo = (p) => setPage(Math.min(pageCount, Math.max(1, p)));

    return (
        <section className="card products-table">
            <header className="card__header">
                <h2>Liste des produits (paginée)</h2>
                <div className="products-table__meta">
                    <span>{total} élément(s)</span>
                </div>
            </header>

            <div className="table-wrapper table-wrapper--noScroll">
                <table>
                    <thead>
                    <tr>
                        <th style={{width: 80}}>ID</th>
                        <th>Nom</th>
                        <th>Marque</th>
                        <th style={{width: 120}}>Prix</th>
                        <th style={{width: 160}}>Catégorie</th>
                        <th>Description</th>
                    </tr>
                    </thead>
                    <tbody>
                    {displayRows.map((row) => (
                        <tr key={row.id}>
                            <td>{row.id}</td>
                            <td className="cell-ellipsis">{row.nom}</td>
                            <td>{row.marque}</td>
                            <td>{row.prix} €</td>
                            <td>{row.categorie}</td>
                            <td className="cell-ellipsis">{row.description}</td>
                        </tr>
                    ))}
                    {displayRows.length === 0 && (
                        <tr>
                            <td colSpan={6} style={{textAlign:"center", padding: "24px"}}>
                                Aucun résultat.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            <footer className="pagination">
                <div className="pagination__info">
                    {total === 0 ? (
                        "0 résultat"
                    ) : (
                        <>
                            {startIndex + 1} – {endIndex} sur {total} résultat(s)
                        </>
                    )}
                </div>

                <div className="pagination__controls">
                    <button className="btn" onClick={() => goTo(page - 1)} disabled={page === 1}>
                        ← Précédent
                    </button>

                    {/* numéros simples (jusqu'à 7 affichés max) */}
                    {Array.from({ length: pageCount }, (_, i) => i + 1)
                        .filter(p => p === 1 || p === pageCount || Math.abs(p - page) <= 2)
                        .map((p, idx, arr) => {
                            // ajout de "…" quand on saute des pages
                            const prev = arr[idx - 1];
                            const needsDots = prev && p - prev > 1;
                            return (
                                <React.Fragment key={p}>
                                    {needsDots && <span className="dots">…</span>}
                                    <button
                                        className={`btn page-btn ${p === page ? "is-active" : ""}`}
                                        onClick={() => goTo(p)}
                                    >
                                        {p}
                                    </button>
                                </React.Fragment>
                            );
                        })}

                    <button className="btn" onClick={() => goTo(page + 1)} disabled={page === pageCount}>
                        Suivant →
                    </button>
                </div>
            </footer>
        </section>
    );
}
