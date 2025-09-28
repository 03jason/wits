import React, { useState } from 'react';
import { createProduct } from '../api/products';

export default function ProductForm({ onCreated }) {
    const [name, setName] = useState('');
    const [sku, setSku] = useState('');
    const [price, setPrice] = useState('');
    const [minThreshold, setMinThreshold] = useState('');
    const [location, setLocation] = useState('');
    const [initialQty, setInitialQty] = useState('');

    const submit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                name: name.trim(),
                sku: sku || undefined,
                price: price ? Number(price) : undefined,
                min_threshold: minThreshold ? Number(minThreshold) : undefined,
                location: location || undefined,
                initial_qty: initialQty ? Number(initialQty) : 0
            };
            const p = await createProduct(payload);
            onCreated?.(p);
            setName(''); setSku(''); setPrice(''); setMinThreshold(''); setLocation(''); setInitialQty('');
            alert('Produit créé.');
        } catch (e2) {
            alert(`Erreur création: ${e2.message}`);
        }
    };

    return (
        <form className="card" onSubmit={submit}>
            <div className="row">
                <input required placeholder="Nom *" value={name} onChange={e=>setName(e.target.value)} />
                <input placeholder="SKU" value={sku} onChange={e=>setSku(e.target.value)} />
                <input placeholder="Prix" type="number" step="0.01" value={price} onChange={e=>setPrice(e.target.value)} />
            </div>
            <div className="row" style={{marginTop:8}}>
                <input placeholder="Seuil min." type="number" value={minThreshold} onChange={e=>setMinThreshold(e.target.value)} />
                <input placeholder="Emplacement" value={location} onChange={e=>setLocation(e.target.value)} />
                <input placeholder="Stock initial" type="number" value={initialQty} onChange={e=>setInitialQty(e.target.value)} />
                <button type="submit">Créer</button>
            </div>
        </form>
    );
}
