import React, { useEffect, useState } from 'react';
import { listProducts } from '../api/products';

export default function ProductList({ onSelect }) {
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
            const data = await listProducts(p, size, query);
            setItems(data.items || []);
            setTotal(data.total || 0);
        } catch (e) {
            alert(`Erreur chargement produits: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(1, ''); }, []);

    return (
        <div className="card">
            <div className="row">
                <input placeholder="Rechercher (nom / SKU)" value={q} onChange={e=>setQ(e.target.value)} />
                <button onClick={()=>{ setPage(1); load(1, q); }}>Rechercher</button>
                <span className="help">Total: {total}</span>
            </div>

            <table className="table">
                <thead>
                <tr><th>ID</th><th>Nom</th><th>SKU</th><th>Stock</th><th>Seuil</th><th>État</th><th></th></tr>
                </thead>
                <tbody>
                {items.map(p => (
                    <tr key={p.product_id}>
                        <td>{p.product_id}</td>
                        <td>{p.product_name}</td>
                        <td>{p.product_sku || '—'}</td>
                        <td>{p.current_stock ?? 0}</td>
                        <td>{p.product_min_threshold ?? '—'}</td>
                        <td>
                            {Number(p.is_below_threshold) === 1
                                ? <span className="badge danger">Sous seuil</span>
                                : <span className="badge">OK</span>}
                        </td>
                        <td>
                            <button onClick={()=> onSelect?.(p)}>Sélectionner</button>
                        </td>
                    </tr>
                ))}
                {items.length === 0 && (
                    <tr><td colSpan="7">Aucun produit</td></tr>
                )}
                </tbody>
            </table>

            <div className="row" style={{justifyContent:'space-between', marginTop:12}}>
                <button disabled={page<=1 || loading} onClick={()=>{ const np = page-1; setPage(np); load(np, q); }}>◀ Préc.</button>
                <span>Page {page}/{pages}</span>
                <button disabled={page>=pages || loading} onClick={()=>{ const np = page+1; setPage(np); load(np, q); }}>Suiv. ▶</button>
            </div>
        </div>
    );
}
