import React, { useMemo, useState } from "react";

/* Composants */
import ProductFilters from "../components/products/FilterBar.jsx";
import QuickMovement from "../components/products/MovementQuickForm.jsx";
import ProductsTable from "../components/products/ProductsTable.jsx";
import ProductInformation from "../components/products/ProductInformation.jsx";

/* CSS (IMPORTANT) */
import "../assets/products.css";

export default function ProductsPage() {
    // —— Ratios modifiables (option A : via constantes JS) ——
    // Tu peux changer ici, ex: "2fr 1fr" etc.
    const HEADER_COLS = "3fr 2fr";   // ≈ 60/40 : (Filtres | Mouvement)
    const CONTENT_COLS = "2fr 3fr";  // ≈ 40/60 : (Table  | Fiche)

    // —— États : filtres + sélection ——
    const [filters, setFilters] = useState({
        keyword: "",
        createdBy: "",
        active: "",           // "" | "active" | "inactive"
        priceMin: "",
        priceMax: "",
        stockMin: "",
        stockMax: "",
    });

    const [selectedId, setSelectedId] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleSelect = (prod) => {
        setSelectedId(prod?.id ?? null);
        setSelectedProduct(prod ?? null);
    };

    // —— Styles : tu peux AUSSI piloter par CSS variables (option B) ——
    const layoutVars = useMemo(
        () => ({
            // change-les ici si tu préfères piloter par CSS custom properties
            "--header-cols": HEADER_COLS,
            "--content-cols": CONTENT_COLS,
        }),
        [HEADER_COLS, CONTENT_COLS]
    );

    return (
        <div className="products-page" style={layoutVars}>
            {/* HEADER (Filtres | Mouvement rapide) — les composants incluent leur propre titre */}
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
                />

                <ProductInformation product={selectedProduct} />
            </section>
        </div>
    );
}
