import React, { useState } from 'react';
import { api } from '../api/client';
import { emitRefresh } from '../lib/refreshBus';

/** Formulaire création produit (anti double-submit + UX simple) */
export default function ProductForm({ onCreated }) {
    const [name, setName] = useState('');
    const [sku, setSku] = useState('');
    const [price, setPrice] = useState('');
    const [minThreshold, setMinThreshold] = useState('');
    const [initialQty, setInitialQty] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitting) return;
        setSubmitting(true);
        try {
            const payload = {
                name: name.trim(),
                sku: sku.trim().toUpperCase(),
                price: price !== '' ? parseFloat(price) : undefined,
                min_threshold: minThreshold !== '' ? parseInt(minThreshold, 10) : undefined,
                initial_qty: initialQty !== '' ? parseInt(initialQty, 10) : undefined,
            };
            await api.products.create(payload);
            emitRefresh('products');
            onCreated?.();  // tu peux garder si tu veux, mais le bus suffit

            // Reset champs
            setName(''); setSku(''); setPrice(''); setMinThreshold(''); setInitialQty('');
            // Rafraîchit la liste (ton App passe déjà reloadList)
            onCreated?.();
        } catch (err) {
            if (String(err.message).includes('sku_exists')) alert('SKU déjà utilisé');
            else alert('Création échouée: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form className="row" onSubmit={handleSubmit} style={{ marginBottom: 12 }}>
            <input placeholder="Nom" value={name} onChange={(e)=>setName(e.target.value)} required />
            <input placeholder="SKU" value={sku} onChange={(e)=>setSku(e.target.value)} required />
            <input placeholder="Prix" type="number" step="0.01" value={price} onChange={(e)=>setPrice(e.target.value)} />
            <input placeholder="Seuil min." type="number" min="0" value={minThreshold} onChange={(e)=>setMinThreshold(e.target.value)} />
            <input placeholder="Qté initiale" type="number" min="0" value={initialQty} onChange={(e)=>setInitialQty(e.target.value)} />
            <button type="submit" disabled={submitting}>{submitting ? 'Création…' : 'Créer'}</button>
        </form>
    );
}
