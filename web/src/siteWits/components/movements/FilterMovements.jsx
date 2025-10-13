import React, { useMemo } from "react";

/**
 * Composant de filtre “contrôlé”.
 *
 * Props:
 *  - value: {
 *      q: string,
 *      type: string,          // 'ALL' | 'IN' | 'OUT' | 'SALES' | 'REFUND' | 'PURCHASE' | 'RETURN' | 'DATA' | 'BURN'
 *      from: string,          // 'YYYY-MM-DD'
 *      to: string,            // 'YYYY-MM-DD'
 *      minQty: string,        // number as string for inputs
 *      maxQty: string,
 *      by: string,            // opérateur (“par”)
 *      withNote: boolean
 *    }
 *  - onChange: (nextValue) => void
 *  - onReset?: () => void
 */
export default function FilterMovements({ value, onChange, onReset }) {
    const types = useMemo(
        () => ["ALL","IN","OUT","SALES","REFUND","PURCHASE","RETURN","DATA","BURN"],
        []
    );

    const handle = (patch) => onChange({ ...value, ...patch });

    return (
        <div className="mv-filter">
            <div className="mv-filter-row">
                <div className="mv-filter-field">
                    <label>Recherche</label>
                    <input
                        type="text"
                        placeholder="Produit, note..."
                        value={value.q}
                        onChange={(e) => handle({ q: e.target.value })}
                    />
                </div>

                <div className="mv-filter-field">
                    <label>Type</label>
                    <select
                        value={value.type}
                        onChange={(e) => handle({ type: e.target.value })}
                    >
                        {types.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>

                <div className="mv-filter-field">
                    <label>De (date)</label>
                    <input
                        type="date"
                        value={value.from}
                        onChange={(e) => handle({ from: e.target.value })}
                    />
                </div>

                <div className="mv-filter-field">
                    <label>À (date)</label>
                    <input
                        type="date"
                        value={value.to}
                        onChange={(e) => handle({ to: e.target.value })}
                    />
                </div>
            </div>

            <div className="mv-filter-row">
                <div className="mv-filter-field">
                    <label>Qté min</label>
                    <input
                        type="number"
                        inputMode="numeric"
                        placeholder="min"
                        value={value.minQty}
                        onChange={(e) => handle({ minQty: e.target.value })}
                    />
                </div>

                <div className="mv-filter-field">
                    <label>Qté max</label>
                    <input
                        type="number"
                        inputMode="numeric"
                        placeholder="max"
                        value={value.maxQty}
                        onChange={(e) => handle({ maxQty: e.target.value })}
                    />
                </div>

                <div className="mv-filter-field">
                    <label>Par</label>
                    <input
                        type="text"
                        placeholder="opérateur (ex: jason)"
                        value={value.by}
                        onChange={(e) => handle({ by: e.target.value })}
                    />
                </div>


                <div className="mv-filter-field mv-filter-checkbox">
                    <label className="mv-check">
                        <input
                            type="checkbox"
                            checked={value.withNote}
                            onChange={(e) => handle({ withNote: e.target.checked })}
                        />
                        <span>Avec note</span>
                    </label>
                </div>

                <div className="mv-filter-actions">
                    <button className="mv-btn" onClick={onReset}>Réinitialiser</button>
                </div>
            </div>
        </div>
    );
}
