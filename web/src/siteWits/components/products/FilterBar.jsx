import React, { useEffect, useState } from "react";

/**
 * Props:
 *  - value: {
 *      keyword, createdBy, active, priceMin, priceMax, stockMin, stockMax
 *    }
 *  - onChange(nextValue)
 */
export default function ProductFilters({ value, onChange }) {
    const [local, setLocal] = useState({
        keyword: "",
        createdBy: "",
        active: "",
        priceMin: "",
        priceMax: "",
        stockMin: "",
        stockMax: "",
    });

    // hydrate local from controlled value
    useEffect(() => {
        if (value) setLocal({ ...local, ...value });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value?.keyword, value?.createdBy, value?.active, value?.priceMin, value?.priceMax, value?.stockMin, value?.stockMax]);

    // propagate changes upward debounced-ish (simple direct here)
    useEffect(() => {
        onChange?.(local);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [local]);

    const update = (patch) => setLocal((prev) => ({ ...prev, ...patch }));
    const reset = () =>
        setLocal({
            keyword: "",
            createdBy: "",
            active: "",
            priceMin: "",
            priceMax: "",
            stockMin: "",
            stockMax: "",
        });

    return (
        <section className="card filter-bar">
            <header className="card__header">
                <h2>Filtres</h2>
            </header>
            <div className="card__body">
                <div className="filter-grid">
                    <div className="field">
                        <label>Mot-clé</label>
                        <input
                            type="text"
                            placeholder="Nom, SKU, marque, catégorie…"
                            value={local.keyword}
                            onChange={(e) => update({ keyword: e.target.value })}
                        />
                    </div>

                    <div className="field">
                        <label>Créé par</label>
                        <input
                            type="text"
                            placeholder="Nom de l'auteur (ex: Jason)"
                            value={local.createdBy}
                            onChange={(e) => update({ createdBy: e.target.value })}
                        />
                    </div>

                    <div className="field">
                        <label>Statut</label>
                        <select
                            value={local.active}
                            onChange={(e) => update({ active: e.target.value })}
                        >
                            <option value="">Tous</option>
                            <option value="active">Actifs</option>
                            <option value="inactive">Inactifs</option>
                        </select>
                    </div>

                    <div className="field">
                        <label>Prix min</label>
                        <input
                            type="number"
                            inputMode="decimal"
                            placeholder="0"
                            value={local.priceMin}
                            onChange={(e) => update({ priceMin: e.target.value })}
                        />
                    </div>
                    <div className="field">
                        <label>Prix max</label>
                        <input
                            type="number"
                            inputMode="decimal"
                            placeholder="9999"
                            value={local.priceMax}
                            onChange={(e) => update({ priceMax: e.target.value })}
                        />
                    </div>

                    <div className="field">
                        <label>Stock min</label>
                        <input
                            type="number"
                            inputMode="numeric"
                            placeholder="0"
                            value={local.stockMin}
                            onChange={(e) => update({ stockMin: e.target.value })}
                        />
                    </div>
                    <div className="field">
                        <label>Stock max</label>
                        <input
                            type="number"
                            inputMode="numeric"
                            placeholder="99999"
                            value={local.stockMax}
                            onChange={(e) => update({ stockMax: e.target.value })}
                        />
                    </div>
                </div>

                <div className="filter-actions">
                    <button className="btn" onClick={reset}>Réinitialiser</button>
                </div>
            </div>
        </section>
    );
}
