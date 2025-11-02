import React from "react";

/**
 * Affiche les détails du produit sélectionné
 * @param {Object} product - Produit sélectionné ou null
 */
export default function ProductInformation({ product }) {
    if (!product) {
        return (
            <section className="card product-info">
                <header className="card__header">
                    <h2>Détails produit</h2>
                </header>
                <div className="card__body" style={{ opacity: 0.8 }}>
                    Sélectionnez un produit dans la liste pour afficher ses détails.
                </div>
            </section>
        );
    }

    return (
        <section className="card product-info">
            <header className="card__header">
                <h2>
                    Détails produit — {product.product_name}
                </h2>
            </header>

            <div className="product-info__body">
                <div className="product-info__media">
                    {/* Placeholder d’image, tu brancheras plus tard */}
                    <div className="img-placeholder">Image</div>
                </div>

                <div className="info-grid">
                    <div className="info-item">
                        <div className="info-label">ID</div>
                        <div className="info-value">{product.product_id}</div>
                    </div>

                    <div className="info-item">
                        <div className="info-label">SKU</div>
                        <div className="info-value">{product.product_sku || "-"}</div>
                    </div>

                    <div className="info-item">
                        <div className="info-label">Nom</div>
                        <div className="info-value">{product.product_name}</div>
                    </div>

                    <div className="info-item">
                        <div className="info-label">Catégorie</div>
                        <div className="info-value">{product.category_name || "-"}</div>
                    </div>

                    <div className="info-item">
                        <div className="info-label">Prix</div>
                        <div className="info-value">
                            {Number.isFinite(Number(product.product_price))
                                ? Number(product.product_price).toFixed(2) + " €"
                                : "-"}
                        </div>
                    </div>

                    <div className="info-item">
                        <div className="info-label">Stock</div>
                        <div className="info-value">
                            {Number.isFinite(Number(product.current_stock))
                                ? product.current_stock
                                : "-"}
                        </div>
                    </div>

                    <div className="info-item info-item--span2 info-desc">
                        <div className="info-label">Description</div>
                        <div className="info-value">
                            {product.product_description || "—"}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
