import React, { useState } from "react";

/**
 * Props:
 *  - rows: []
 *  - onSelect: (row)=>void
 *  - selectedId?: string | number
 */
export default function MovementsList({ rows = [], onSelect, selectedId: controlledSel }) {
    // si le parent ne fournit pas selectedId, on garde un état local
    const [localSel, setLocalSel] = useState(null);
    const selectedId = controlledSel ?? localSel;

    const handleClick = (row) => {
        setLocalSel(row.id);
        onSelect && onSelect(row);
    };

    const tagClass = (t) => `mv-tag ${String(t || "").toLowerCase()}`;

    function formatDate(dateString) {
        if (!dateString) return "-";
        const d = new Date(dateString);
        if (isNaN(d)) return "-";
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    }






    return (
        <>
            <div className="mv-list-head">
                <h3 className="mv-title">Derniers mouvements</h3>
                <div className="mv-actions">
                    <button className="mv-btn">Exporter</button>
                    <button className="mv-btn primary">Nouveau mouvement</button>
                </div>
            </div>

            <div className="mv-table-wrap">
                <table className="mv-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Date</th>
                        <th>Produit</th>
                        <th>Type</th>
                        <th>Qté</th>
                        <th>Par</th>
                        <th>Note</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows.map((r) => (
                        <tr
                            key={r.id}
                            onClick={() => handleClick(r)}
                            className={selectedId === r.id ? "selected" : ""}
                        >
                            <td className="mono">{r.id}</td>
                            <td>{r.date}</td>
                            <td>{r.product}</td>
                            <td><span className={tagClass(r.type)}>{r.type}</span></td>
                            <td className="mono">{r.qty}</td>
                            <td>{r.by}</td>
                            <td>{r.note || ""}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
