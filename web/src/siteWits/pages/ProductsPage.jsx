import React, { useEffect, useMemo, useState } from "react";

/* Composants */
import ProductFilters from "../components/products/FilterBar.jsx";
import QuickMovement from "../components/products/MovementQuickForm.jsx";
import ProductsTable from "../components/products/ProductsTable.jsx";
import ProductInformation from "../components/products/ProductInformation.jsx";


/* CSS (IMPORTANT) */
import "../assets/products.css";

/* API */
import { API_BASE_PRODUCTS } from "../api/client.js";

export default function ProductsPage() {
    // —— Layout —— //
    const HEADER_COLS = "3fr 2fr";
    const CONTENT_COLS = "2fr 3fr";

    // —— États —— //
    const [filters, setFilters] = useState({
        keyword: "",
        createdBy: "",
        active: "",
        priceMin: "",
        priceMax: "",
        stockMin: "",
        stockMax: "",
    });

    const [products, setProducts] = useState([]); // Données récupérées
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // —— Fetch API —— //
    useEffect(() => {
        let alive = true;

        async function fetchProducts() {
            try {
                const res = await fetch(`${API_BASE_PRODUCTS}/products`);
                if (!res.ok) throw new Error(`Erreur API (${res.status})`);
                const data = await res.json();
                if (alive) {
                    setProducts(Array.isArray(data) ? data : []);
                }
            } catch (err) {
                console.error("Erreur API Produits :", err);
                if (alive) setError(err.message || "Erreur de chargement");
            } finally {
                if (alive) setLoading(false);
            }
        }

        fetchProducts();
        return () => {
            alive = false;
        };
    }, []);

    // —— Sélection d’un produit —— //
    const handleSelect = (prod) => {
        setSelectedId(prod?.product_id ?? null);
        setSelectedProduct(prod ?? null);
    };

    // —— Style Layout —— //
    const layoutVars = useMemo(
        () => ({
            "--header-cols": HEADER_COLS,
            "--content-cols": CONTENT_COLS,
        }),
        [HEADER_COLS, CONTENT_COLS]
    );

    // —— Rendu —— //
    if (loading) {
        return <p style={{ padding: "2rem" }}>Chargement des produits...</p>;
    }

    if (error) {
        return (
            <p style={{ color: "red", padding: "2rem" }}>
                ⚠️ Erreur : {error}
            </p>
        );


    }

    return (
        <div className="products-page" style={layoutVars}>
            {/* HEADER (Filtres | Mouvement rapide) */}
            <section className="products-header">
                <ProductFilters value={filters} onChange={setFilters} />
                <QuickMovement />
            </section>

            {/* CONTENT (Table | Fiche produit) */}
            <section className="products-content">
                <ProductsTable
                    filters={filters}
                    selectedId={selectedId}
                    onSelect={handleSelect}
                    data={products} // ⬅️ on passe les données ici
                />

                <ProductInformation product={selectedProduct} />
            </section>
        </div>
    );
}
