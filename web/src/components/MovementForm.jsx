import React, { useEffect, useState } from 'react';
import { createMovement } from '../api/movements';
import { listProducts } from '../api/products';

export default function MovementForm({ onRecorded }) {
    const [type, setType] = useState('IN');
    const [quantity, setQuantity] = useState('');
    const [note, setNote] = useState('');
    const [productId, setProductId] = useState('');
    const [products, setProducts] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const d = await listProducts(1, 100, '');
                setProducts(d.items || []);
            } catch (e) {
                // silencieux: le formulaire reste utilisable si liste vide
            }
        })();
    }, []);

    const submit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                product_id: Number(productId),
                type,
                quantity: Number(quantity),
                note: note || undefined
            };
            const r = await createMovement(payload);
            onRecorded?.(r);
            setQuantity(''); setNote('');
            alert(`${type} enregistré. Stock courant: ${r.stock}`);
        } catch (e2) {
            alert(`Erreur mouvement: ${e2.message}`);
        }
    };

    return (
        <form className="card" onSubmit={submit}>
            <div className="row">
                <select value={productId} onChange={e=>setProductId(e.target.value)} required>
                    <option value="">-- Produit --</option>
                    {products.map(p => (
                        <option key={p.product_id} value={p.product_id}>
                            #{p.product_id} · {p.product_name} (stock {p.current_stock ?? 0})
                        </option>
                    ))}
                </select>
                <select value={type} onChange={e=>setType(e.target.value)}>
                    <option value="IN">IN</option>
                    <option value="OUT">OUT</option>
                </select>
                <input required type="number" placeholder="Quantité" value={quantity} onChange={e=>setQuantity(e.target.value)} />
                <input placeholder="Note (optionnel)" value={note} onChange={e=>setNote(e.target.value)} />
                <button type="submit">Valider</button>
            </div>
            <div className="help">Règle: OUT ≤ stock courant (refus si dépasse).</div>
        </form>
    );
}
