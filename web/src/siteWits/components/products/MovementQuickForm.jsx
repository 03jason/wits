import React, { useState } from "react";

export default function MovementQuickForm() {
    const [form, setForm] = useState({
        productRef: "",
        type: "OUT",
        quantity: 1,
        comment: "",
    });

    const update = (patch) => setForm((p) => ({ ...p, ...patch }));

    const submit = (e) => {
        e.preventDefault();
        console.log("[QuickMovement] submit ->", form);
        // TODO: brancher l'API quand tu voudras
    };

    const reset = () => {
        setForm({ productRef: "", type: "OUT", quantity: 1, comment: "" });
    };

    return (
        <section className="card quick-movement">
            <header className="card__header">
                <h2>Mouvement rapide</h2>
            </header>

            <form className="card__body" onSubmit={submit}>
                <div className="qm-grid">
                    <div className="field">
                        <label>Produit (ID ou SKU)</label>
                        <input
                            type="text"
                            placeholder="ex: 42 ou SKU-FOO"
                            value={form.productRef}
                            onChange={(e) => update({ productRef: e.target.value })}
                            required
                        />
                    </div>

                    <div className="field">
                        <label>Type</label>
                        <select
                            value={form.type}
                            onChange={(e) => update({ type: e.target.value })}
                        >
                            <option value="IN">IN</option>
                            <option value="OUT">OUT</option>
                            <option value="SALE">SALE</option>
                            <option value="REFUND">REFUND</option>
                            <option value="DATA">DATA</option>
                            <option value="BURN">BURN</option>
                        </select>
                    </div>

                    <div className="field">
                        <label>Quantité</label>
                        <input
                            type="number"
                            inputMode="numeric"
                            min={1}
                            step={1}
                            value={form.quantity}
                            onChange={(e) => update({ quantity: Number(e.target.value) })}
                            required
                        />
                    </div>

                    <div className="field field--span2">
                        <label>Commentaire (optionnel)</label>
                        <textarea
                            placeholder="ex: casse, promo, inventaire, …"
                            rows={3}
                            value={form.comment}
                            onChange={(e) => update({ comment: e.target.value })}
                        />
                    </div>
                </div>

                <div className="qm-actions">
                    <button className="btn" type="button" onClick={reset}>
                        Effacer
                    </button>
                    <button className="btn btn--primary" type="submit">
                        Valider
                    </button>
                </div>
            </form>
        </section>
    );
}
