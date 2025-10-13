import React from "react";

function Badge({ type }) {
    const lower = (type || "").toLowerCase();
    const map = {
        in: "badge--in",
        out: "badge--out",
        sale: "badge--sales",
        refund: "badge--sales",
        data: "badge--data",
        burn: "badge--burn",
    };
    const cls = "badge " + (map[lower] || "");
    return type ? <span className={cls}>{type}</span> : null;
}

export default function ProductInformation({ product }) {
    return (
        <section className="card product-info">
            <header className="card__header">
                <h2>Détails produit {product ? <>— {product.name} <Badge type={product.last_type}/></> : ""}</h2>
            </header>

            {!product ? (
                <div className="card__body" style={{opacity:.8}}>
                    Sélectionnez un produit dans la liste pour afficher ses détails.
                </div>
            ) : (
                <>
                    <div className="product-info__body">
                        <div className="product-info__media">
                            {/* placeholder (tu brancheras une vraie image plus tard) */}
                            <div className="img-placeholder">Image</div>
                        </div>

                        <div className="info-grid">
                            <div className="info-item">
                                <div className="info-label">ID</div>
                                <div className="info-value">{product.id}</div>
                            </div>
                            <div className="info-item">
                                <div className="info-label">SKU</div>
                                <div className="info-value">{product.sku}</div>
                            </div>

                            <div className="info-item">
                                <div className="info-label">Nom</div>
                                <div className="info-value">{product.name}</div>
                            </div>
                            <div className="info-item">
                                <div className="info-label">Catégorie</div>
                                <div className="info-value">{product.category}</div>
                            </div>

                            <div className="info-item">
                                <div className="info-label">Marque</div>
                                <div className="info-value">{product.brand}</div>
                            </div>
                            <div className="info-item">
                                <div className="info-label">Prix</div>
                                <div className="info-value">{product.price?.toFixed(2)} €</div>
                            </div>

                            <div className="info-item">
                                <div className="info-label">Dernier mouvement</div>
                                <div className="info-value">{product.last_type || "—"}</div>
                            </div>
                            <div className="info-item">
                                <div className="info-label">Stock</div>
                                <div className="info-value">{product.stock ?? "—"}</div>
                            </div>

                            <div className="info-item info-item--span2 info-desc">
                                <div className="info-label">Description</div>
                                <div className="info-value">{product.description || "—"}</div>
                            </div>
                        </div>
                    </div>

                    <div className="product-info__actions">
                        <button className="btn btn--primary" type="button">Modifier</button>
                        <button className="btn btn--danger" type="button">Supprimer</button>
                    </div>
                </>
            )}
        </section>
    );
}
