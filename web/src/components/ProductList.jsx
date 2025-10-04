import React, { useState, useEffect, useCallback } from "react";
import { apiBase } from "../api/client";

/**
 * Hook réutilisable pour charger les produits depuis l’API.
 */
function useProducts(page, size, query, refreshKey) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const url = new URL(`${apiBase}/api/products/enriched`);
            url.searchParams.set("page", page);
            url.searchParams.set("size", size);
            if (query) url.searchParams.set("q", query);

            const res = await fetch(url);
            if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
            const data = await res.json();

            setProducts(data.items || []);
        } catch (err) {
            console.error("Erreur de chargement produits:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [page, size, query]);

    useEffect(() => {
        loadProducts();
    }, [loadProducts, refreshKey]);

    return { products, loading, error, reload: loadProducts };
}

/**
 * Liste des produits (avec ajout, édition et suppression auto-refresh).
 */
export default function ProductList() {
    const [page, setPage] = useState(1);
    const [size] = useState(25);
    const [query, setQuery] = useState("");
    const [refreshKey, setRefreshKey] = useState(0);

    const { products, loading, error, reload } = useProducts(
        page,
        size,
        query,
        refreshKey
    );

    // Déclenche un rafraîchissement de la liste
    const triggerRefresh = () => setRefreshKey(prev => prev + 1);

    // Suppression d’un produit
    const handleDelete = async id => {
        if (!window.confirm("Supprimer ce produit ?")) return;
        try {
            const res = await fetch(`${apiBase}/api/products/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
            triggerRefresh();
        } catch (err) {
            alert("Erreur lors de la suppression : " + err.message);
        }
    };

    // Édition du prix (petit test d’édition simple)
    const handleEditPrice = async (id, newPrice) => {
        try {
            const res = await fetch(`${apiBase}/api/products/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ price: newPrice }),
            });
            if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
            triggerRefresh();
        } catch (err) {
            alert("Erreur lors de la mise à jour : " + err.message);
        }
    };

    return (
        <div className="card">
            <h3>Produits</h3>

            <input
                type="search"
                placeholder="Rechercher un produit..."
                value={query}
                onChange={e => setQuery(e.target.value)}
            />

            {loading && <p>Chargement...</p>}
            {error && <p className="error">Erreur : {error}</p>}

            {!loading && !error && (
                <table className="product-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nom</th>
                        <th>SKU</th>
                        <th>Quantité</th>
                        <th>Prix</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products.map(p => (
                        <tr key={p.product_id}>
                            <td>{p.product_id}</td>
                            <td>{p.product_name}</td>
                            <td>{p.product_sku}</td>
                            <td>{p.current_stock ?? "?"}</td>
                            <td>{p.product_price ?? "?"} €</td>
                            <td>
                                <button
                                    onClick={() =>
                                        handleEditPrice(
                                            p.product_id,
                                            prompt("Nouveau prix :", p.product_price)
                                        )
                                    }
                                >
                                    ✏ Modifier
                                </button>
                                <button onClick={() => handleDelete(p.product_id)}>
                                    🗑 Supprimer
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            <div className="pagination">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                    ◀ Précédent
                </button>
                <span>Page {page}</span>
                <button onClick={() => setPage(p => p + 1)}>Suivant ▶</button>
            </div>
        </div>
    );
}
