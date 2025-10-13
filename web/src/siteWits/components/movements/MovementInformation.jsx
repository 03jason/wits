import React from "react";

/**
 * Props:
 *  - movement: objet mouvement sélectionné ou null
 *
 * Convention conseillée côté données:
 *  {
 *    id, date, product, type, qty, by, note,
 *    diff?: [ { field: "price", before: 12.5, after: 10.9 }, ... ]   // seulement pour type === "DATA"
 *  }
 */
export default function MovementInformation({ movement }) {
    if (!movement) {
        return (
            <div className="mv-info-empty">
                <h3 className="mv-title">Informations du mouvement</h3>
                <p className="mv-muted">Sélectionnez un mouvement dans la liste pour voir le détail ici.</p>
            </div>
        );
    }

    const isDATA = (movement.type || "").toUpperCase() === "DATA";

    return (
        <div className="mv-info-wrap">
            <div className="mv-info-head">
                <h3 className="mv-title">Mouvement #{movement.id}</h3>
                <span className={`mv-tag ${movement.type?.toLowerCase() || ''}`}>{movement.type}</span>
            </div>

            <div className="mv-info-grid">
                <div>
                    <div className="mv-muted">Date</div>
                    <div>{movement.date}</div>
                </div>
                <div>
                    <div className="mv-muted">Produit</div>
                    <div>{movement.product}</div>
                </div>
                <div>
                    <div className="mv-muted">Quantité</div>
                    <div className="mono">{movement.qty}</div>
                </div>
                <div>
                    <div className="mv-muted">Par</div>
                    <div>{movement.by}</div>
                </div>
            </div>

            {movement.note ? (
                <div className="mv-info-note">
                    <div className="mv-muted">Note</div>
                    <div>{movement.note}</div>
                </div>
            ) : null}

            {isDATA ? (
                <div className="mv-info-diff">
                    <div className="mv-info-diff-head">
                        <strong>Modification de données</strong>
                        <span className="mv-muted">avant ⟶ après</span>
                    </div>
                    {Array.isArray(movement.diff) && movement.diff.length > 0 ? (
                        <table className="mv-diff-table">
                            <thead>
                            <tr>
                                <th>Champ</th>
                                <th>Avant</th>
                                <th>Après</th>
                            </tr>
                            </thead>
                            <tbody>
                            {movement.diff.map((d, idx) => (
                                <tr key={idx}>
                                    <td className="mono">{d.field}</td>
                                    <td>{formatVal(d.before)}</td>
                                    <td>{formatVal(d.after)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="mv-muted">Aucune différence détaillée fournie.</div>
                    )}
                </div>
            ) : (
                <div className="mv-info-generic">
                    <div className="mv-muted">Détail brut</div>
                    <pre className="mv-info-pre">{JSON.stringify(movement, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}

function formatVal(v) {
    if (v === null || v === undefined) return "—";
    if (typeof v === "number") return String(v);
    return String(v);
}
