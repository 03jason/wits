import React, { useState } from "react";

/**
 * Affiche la liste des mouvements sous forme de tableau.
 * Props:
 *  - rows: []
 *  - onSelect: (row)=>void
 *  - selectedId?: string | number
 */
export default function MovementsList({ rows = [], onSelect, selectedId: controlledSel }) {
    const [localSel, setLocalSel] = useState(null);
    const selectedId = controlledSel ?? localSel;

    const handleClick = (row) => {
        setLocalSel(row.id);
        onSelect && onSelect(row);
    };

    const tagClass = (t) => `mv-tag ${String(t || "").toLowerCase()}`;

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const d = new Date(dateString);
        if (isNaN(d)) return "-";
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, "0");
        const mins = String(d.getMinutes()).padStart(2, "0");
        return `${day}-${month}-${year} ${hours}:${mins}`;
    };

    return (
        <section className="card movements-table">
            {/* Barre d’en-tête similaire à ProductsTable */}
            <header className="card__header">
                <h2>Mouvements</h2>
                <div className="movements-table__meta">
                    <span>{rows.length} résultat(s)</span>
                    <div className="spacer" />
                    <button className="btn">Exporter</button>
                    <button className="btn btn--primary">Nouveau mouvement</button>
                </div>
            </header>

            {/* Table scrollable */}
            <div className="table-wrapper">
                <table>
                    <thead>
                    <tr>
                        <th style={{ width: 64 }}>ID</th>
                        <th>Date</th>
                        <th>Produit</th>
                        <th>Type</th>
                        <th style={{ width: 80 }}>Qté</th>
                        <th>Par</th>
                        <th>Note</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows.length === 0 ? (
                        <tr>
                            <td colSpan="7" style={{ opacity: 0.7, padding: 16 }}>
                                Aucun mouvement trouvé.
                            </td>
                        </tr>
                    ) : (
                        rows.map((r) => (
                            <tr
                                key={r.id}
                                onClick={() => handleClick(r)}
                                className={selectedId === r.id ? "is-selected" : ""}
                            >
                                <td className="mono">{r.id}</td>
                                <td>{formatDate(r.date)}</td>
                                <td>{r.product}</td>
                                <td><span className={tagClass(r.type)}>{r.type}</span></td>
                                <td className="mono">{r.qty}</td>
                                <td>{r.by}</td>
                                <td>{r.note || ""}</td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </section>
    );

}
