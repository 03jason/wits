// web/src/components/ProductList.jsx
import React, { useEffect, useState } from 'react';
import { api } from '../api/client';

/** Liste des produits (enrichie) + Edit/Delete minimal */
export default function ProductList({ onSelect, refreshKey }) {


    // Chargement initial
    useEffect(() => { load(1, ''); /* reset page + q si tu veux */ }, []);

    // 🔁 Rechargement quand refreshKey change
    useEffect(() => { load(1, ''); }, [refreshKey]);

    // Dans editRow/deleteRow on a déjà: await load(page, q);

    const [q, setQ] = useState('');
    const [page, setPage] = useState(1);
    const [size] = useState(10);
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const pages = Math.max(1, Math.ceil(total / size));

    const load = async (p = page, query = q) => {
        setLoading(true);
        try {
            const data = await api.products.list(p, size, query);
            setItems(data.items ?? data.data ?? []);  // tolérant selon payload
            setTotal(data.total ?? data.count ?? (data.items ? data.items.length : 0));
        } catch (e) {
            alert('Erreur chargement produits: ' + e.message);
            setItems([]); setTotal(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(1, ''); }, []); // initial

    const doSearch = (e) => {
        e?.preventDefault?.();
        setPage(1);
        load(1, q);
    };

    const editRow = async (p) => {
        const priceStr = prompt('Nouveau prix ?', p.product_price ?? 0);
        if (priceStr == null) return;
        const price = parseFloat(priceStr);
        if (!Number.isFinite(price) || price < 0) return alert('Prix invalide');
        try {
            await api.products.update(p.product_id, { price });
            await load(page, q);
            alert('Mis à jour');
        } catch (e) {
            alert('Échec mise à jour: ' + e.message);
        }
    };

    const deleteRow = async (p) => {
        if (!confirm(`Supprimer "${p.product_name}" ? (soft delete)`)) return;
        try {
            await api.products.remove(p.product_id);
            await load(page, q);
            alert('Supprimé');
        } catch (e) {
            if (String(e.message).includes('cannot_delete_non_empty'))
                alert('Refus: stock > 0');
            else
                alert('Échec suppression: ' + e.message);
        }
    };



    return (
        <div>
            <div className="row">
                <input
                    placeholder="Rechercher (nom / SKU)"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                />
                <button onClick={doSearch} disabled={loading}>Rechercher</button>
                <span> Total: {total} </span>
            </div>

            <table className="grid" style={{ marginTop: 12 }}>
                <thead>
                <tr>
                    <th>ID</th><th>Nom</th><th>SKU</th><th>Stock</th><th>Seuil</th><th>État</th><th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {items.map((p) => (
                    <tr key={p.product_id}>
                        <td>{p.product_id}</td>
                        <td>{p.product_name}</td>
                        <td>{p.product_sku}</td>
                        <td>{p.current_stock ?? p.stock ?? 0}</td>
                        <td>{p.product_min_threshold ?? p.threshold ?? 0}</td>
                        <td><span className="badge">{p.is_below_threshold ? 'Alerte' : 'OK'}</span></td>
                        <td className="row" style={{ gap: 6 }}>
                            <button onClick={() => onSelect?.(p)}>Sélectionner</button>
                            <button onClick={() => editRow(p)}>Edit</button>
                            <button onClick={() => deleteRow(p)}>Delete</button>
                        </td>
                    </tr>
                ))}
                {items.length === 0 && (
                    <tr><td colSpan="7">Aucun produit</td></tr>
                )}
                </tbody>
            </table>

            <div className="row" style={{ justifyContent: 'space-between', marginTop: 12 }}>
                <button
                    disabled={page <= 1 || loading}
                    onClick={() => { const np = page - 1; setPage(np); load(np, q); }}
                >◀ Préc.</button>

                <span>Page {page}/{pages}</span>

                <button
                    disabled={page >= pages || loading}
                    onClick={() => { const np = page + 1; setPage(np); load(np, q); }}
                >Suiv. ▶</button>
            </div>
        </div>
    );
}
