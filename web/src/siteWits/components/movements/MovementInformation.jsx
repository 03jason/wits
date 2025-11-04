import React from "react";

/**
 * Props:
 *  - movement: objet mouvement sélectionné ou null
 *  Exemple pour DATA :
 *    {
 *      id, date, product, type, qty, by, note,
 *      meta_before: { ... },
 *      meta_after: { ... }
 *    }
 */
export default function MovementInformation({ movement }) {
    if (!movement) {
        return (
            <div className="mv-info-empty">
                <h3 className="mv-title">Informations du mouvement</h3>
                <p className="mv-muted">
                    Sélectionnez un mouvement dans la liste pour voir le détail ici.
                </p>
            </div>
        );
    }

    const isDATA = (movement.type || "").toUpperCase() === "DATA";

    // Si c’est un mouvement DATA, on tente d’extraire les différences.
    let diffs = [];
    if (isDATA) {
        const before = safeParse(movement.meta_before);
        const after = safeParse(movement.meta_after);
        diffs = buildDiffArray(before, after);
    }

    return (
        <div className="mv-info-wrap">
            <div className="mv-info-head">
                <h3 className="mv-title">Mouvement #{movement.id}</h3>
                <span className={`mv-tag ${movement.type?.toLowerCase() || ""}`}>
                    {movement.type}
                </span>
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
                        <span className="mv-muted">Avant ⟶ Après</span>
                    </div>

                    {diffs.length > 0 ? (
                        <table className="mv-diff-table">
                            <thead>
                            <tr>
                                <th>Champ</th>
                                <th>Avant</th>
                                <th>Après</th>
                            </tr>
                            </thead>
                            <tbody>
                            {diffs.map((d, idx) => (
                                <tr key={idx}>
                                    <td className="mono">{d.field}</td>
                                    <td>{formatVal(d.before)}</td>
                                    <td>{formatVal(d.after)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="mv-muted">
                            Aucune différence détectée entre les deux états.
                        </div>
                    )}
                </div>
            ) : (
                <div className="mv-info-generic">
                    <div className="mv-muted">Détail brut</div>
                    <pre className="mv-info-pre">
                        {JSON.stringify(movement, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}

/**
 * Parse les champs meta_before/meta_after (string ou objet).
 */
function safeParse(val) {
    if (!val) return {};
    if (typeof val === "object") return val;
    try {
        return JSON.parse(val);
    } catch {
        return {};
    }
}

/**
 * Construit un tableau de différences à partir des deux objets.
 */
function buildDiffArray(before, after) {
    const fields = Array.from(
        new Set([...Object.keys(before || {}), ...Object.keys(after || {})])
    );
    return fields
        .map((f) => ({
            field: f,
            before: before?.[f],
            after: after?.[f],
        }))
        .filter((d) => d.before !== d.after);
}

function formatVal(v) {
    if (v === null || v === undefined) return "—";
    if (typeof v === "boolean") return v ? "✔️" : "❌";
    if (typeof v === "number") return String(v);
    return String(v);
}
