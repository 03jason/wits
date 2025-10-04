import React, { useRef, useState } from "react";
import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";
import MovementForm from "./components/MovementForm";
import LoginBar from "./components/LoginBar";

/**
 * Composant principal de l’application WITS.
 * - Structure la page
 * - Gère le rafraîchissement global de la liste produits
 */
export default function App() {
    const [refreshKey, setRefreshKey] = useState(0);
    const listRef = useRef();

    const reloadList = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <>
            <header>
                <h2 style={{ margin: 0 }}>WITS – Gestion de stock</h2>
                <span className="badge">Demo</span>
            </header>

            <div className="container">
                <LoginBar />
                <ProductForm onCreated={reloadList} />
                <MovementForm onRecorded={reloadList} />
                <ProductList key={refreshKey} ref={listRef} />
            </div>
        </>
    );
}
