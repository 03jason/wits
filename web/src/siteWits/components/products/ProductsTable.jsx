import React, { useMemo } from "react";

/** Données factices pour la démo UI */
const FAKE_PRODUCTS = [
    { id: 1,  sku: "SKU-CHAIR",      name: "Chaise",              brand: "IKEA",     price: 29.9,  category: "INDE",  description: "Chaise en bois",           stock: 12, active: true,  created_by: "Alice",  last_type: "IN" },
    { id: 2,  sku: "SKU-SCREEN",     name: "Écran PC",            brand: "Samsung",  price: 189,   category: "MEDIA", description: "24 pouces Full HD",       stock: 5,  active: true,  created_by: "Jason",  last_type: "SALE" },
    { id: 3,  sku: "SKU-RUBIK",      name: "Rubik's Cube 3x3",    brand: "Rubik's",  price: 12.5,  category: "JOUET", description: "Cube classique 3x3",       stock: 30, active: true,  created_by: "Alice",  last_type: "IN" },
    { id: 4,  sku: "SKU-WATER50",    name: "Eau 50cl",            brand: "Evian",    price: 1.1,   category: "NOUR",  description: "Bouteille 0.5L",           stock: 100,active: true,  created_by: "Marco",  last_type: "OUT" },
    { id: 5,  sku: "SKU-CREAMAVO",   name: "Crème corps avocat",  brand: "Nivea",    price: 6.9,   category: "COSM",  description: "Hydratante",               stock: 14, active: true,  created_by: "Jason",  last_type: "DATA" },
    { id: 6,  sku: "SKU-DRILL",      name: "Perceuse",            brand: "Bosch",    price: 89,    category: "BRICO", description: "Sans fil 18V",             stock: 7,  active: true,  created_by: "Lina",   last_type: "IN" },
    { id: 7,  sku: "SKU-ROBOTCOOK",  name: "Robot cuisine",       brand: "Moulinex", price: 149,   category: "CUISI", description: "Multi-fonctions",          stock: 9,  active: true,  created_by: "Lina",   last_type: "SALE" },
    { id: 8,  sku: "SKU-MINCAC",     name: "Mini faux cactus",    brand: "Casa",     price: 4.5,   category: "INDE",  description: "Déco artificielle",        stock: 42, active: true,  created_by: "Alice",  last_type: "IN" },
    { id: 9,  sku: "SKU-OUTCHAIR",   name: "Chaise extérieur",    brand: "IKEA",     price: 39.9,  category: "EXJA",  description: "Résistante UV",             stock: 6,  active: false, created_by: "Marco",  last_type: "BURN" },
    { id:10,  sku: "SKU-BIN",        name: "Corbeille de bureau", brand: "Hema",     price: 5.9,   category: "BREAU", description: "Plastique noir",            stock: 25, active: true,  created_by: "Jason",  last_type: "IN" },
    { id:11,  sku: "SKU-TIE-R",      name: "Cravate rouge",       brand: "Zara",     price: 14.9,  category: "VETEM", description: "Soie",                      stock: 11, active: true,  created_by: "Lina",   last_type: "SALE" },
    { id:12,  sku: "SKU-JBL-SPK",    name: "Baffle stéréo",       brand: "JBL",      price: 89,    category: "MEDIA", description: "Bluetooth compact",          stock: 4,  active: true,  created_by: "Alice",  last_type: "OUT" },
    { id:13,  sku: "SKU-DREFT",      name: "Dreft citron 450ml",  brand: "Dreft",    price: 3.4,   category: "NETOY", description: "Vaisselle",                 stock: 60, active: true,  created_by: "Marco",  last_type: "IN" },
    { id:14,  sku: "SKU-TOTE",       name: "Sac course toile",    brand: "Decathlon",price: 2.9,   category: "BAZAR", description: "Réutilisable",               stock: 80, active: true,  created_by: "Jason",  last_type: "IN" },
    { id:15,  sku: "SKU-PRINCE",     name: "Prince de LU",        brand: "LU",       price: 1.99,  category: "NOUR",  description: "Chocolat",                  stock: 55, active: true,  created_by: "Lina",   last_type: "SALE" },
    { id:16,  sku: "SKU-SCALE",      name: "Balance alimentaire", brand: "Tefal",    price: 17.5,  category: "CUISI", description: "Précision 1g",               stock: 8,  active: true,  created_by: "Alice",  last_type: "DATA" },
    { id:17,  sku: "SKU-ROSE",       name: "Rose de jardin",      brand: "Truffaut", price: 6.5,   category: "EXJA",  description: "Senteur douce",             stock: 13, active: true,  created_by: "Marco",  last_type: "IN" },
    { id:18,  sku: "SKU-BERLIN",     name: "Parfum - Le Berlin",  brand: "Zara",     price: 29,    category: "COSM",  description: "Notes boisées",             stock: 5,  active: true,  created_by: "Jason",  last_type: "REFUND" },
    { id:19,  sku: "SKU-BIC4",       name: "Bic 4 couleurs",      brand: "BIC",      price: 2.5,   category: "BREAU", description: "Classique",                  stock: 120,active: true,  created_by: "Lina",   last_type: "IN" },
    { id:20,  sku: "SKU-SWIF",       name: "Plumeau poussière",   brand: "Swiffer",  price: 6.2,   category: "NETOY", description: "Antistatique",               stock: 18, active: true,  created_by: "Alice",  last_type: "OUT" },
];

function applyFilters(rows, f) {
    if (!f) return rows;

    let out = rows;

    // Mot-clé: name / sku / brand / category / description
    const kw = (f.keyword || "").trim().toLowerCase();
    if (kw) {
        out = out.filter((r) =>
            [r.name, r.sku, r.brand, r.category, r.description]
                .filter(Boolean)
                .some((v) => String(v).toLowerCase().includes(kw))
        );
    }

    // createdBy
    const cb = (f.createdBy || "").trim().toLowerCase();
    if (cb) {
        out = out.filter((r) => String(r.created_by || "").toLowerCase().includes(cb));
    }

    // active
    if (f.active === "active") out = out.filter((r) => !!r.active);
    if (f.active === "inactive") out = out.filter((r) => !r.active);

    // price range
    const pMin = f.priceMin === "" ? null : Number(f.priceMin);
    const pMax = f.priceMax === "" ? null : Number(f.priceMax);
    out = out.filter((r) => {
        const okMin = pMin === null || r.price >= pMin;
        const okMax = pMax === null || r.price <= pMax;
        return okMin && okMax;
    });

    // stock range
    const sMin = f.stockMin === "" ? null : Number(f.stockMin);
    const sMax = f.stockMax === "" ? null : Number(f.stockMax);
    out = out.filter((r) => {
        const okMin = sMin === null || r.stock >= sMin;
        const okMax = sMax === null || r.stock <= sMax;
        return okMin && okMax;
    });

    return out;
}

export default function ProductsTable({ filters, selectedId, onSelect }) {
    const rows = useMemo(() => applyFilters(FAKE_PRODUCTS, filters), [filters]);

    return (
        <section className="card products-table">
            <header className="card__header">
                <h2>Produits</h2>
                <div className="products-table__meta">
                    <span>{rows.length} résultat(s)</span>
                    <span className="spacer" />
                </div>
            </header>

            <div className="table-wrapper">
                <table>
                    <thead>
                    <tr>
                        <th style={{width: 64}}>ID</th>
                        <th>Nom</th>
                        <th>Marque</th>
                        <th style={{width: 120}}>Prix</th>
                        <th style={{width: 120}}>Catégorie</th>
                        <th style={{width: 100}}>Stock</th>
                        <th>Description</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows.map((r) => (
                        <tr
                            key={r.id}
                            className={r.id === selectedId ? "is-selected" : ""}
                            onClick={() => onSelect?.(r)}
                        >
                            <td>{r.id}</td>
                            <td className="cell-ellipsis" title={r.name}>{r.name}</td>
                            <td className="cell-ellipsis" title={r.brand}>{r.brand}</td>
                            <td>{r.price.toFixed(2)} €</td>
                            <td>{r.category}</td>
                            <td>{r.stock}</td>
                            <td className="cell-ellipsis" title={r.description}>
                                {r.description}
                            </td>
                        </tr>
                    ))}
                    {rows.length === 0 && (
                        <tr>
                            <td colSpan={7} style={{opacity:.7, padding: 16}}>
                                Aucun produit ne correspond aux filtres.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
