import React, { useRef, useState } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";

import Home from "./siteWits/pages/Home.jsx";
import TestPage from "./siteWits/pages/TestPage.jsx";

import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";
import MovementForm from "./components/MovementForm";
import LoginBar from "./components/LoginBar";

// Page "démo" = ton écran actuel Produits/Mouvements
function Demo() {
    const [refreshKey, setRefreshKey] = useState(0);
    const listRef = useRef(null);
    const reloadList = () => setRefreshKey(k => k + 1);

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

export default function App() {
    return (
        <>
            {/* Nav globale - DOIT être à l'intérieur d’un Router (ici oui, car <HashRouter> est dans main.jsx) */}
            <nav style={{ padding: 12, borderBottom: "1px solid #1f2937" }}>
                <Link to="/home" style={{ marginRight: 12 }}>Home</Link>
                <Link to="/test" style={{ marginRight: 12 }}>TestPage</Link>
                <Link to="/demo">Demo (Produits/Mouvements)</Link>
            </nav>

            <Routes>
                {/* Redirige la racine vers /demo pour garder ton écran actuel par défaut */}
                <Route path="/" element={<Navigate to="/demo" replace />} />
                <Route path="/home" element={<Home />} />
                <Route path="/test" element={<TestPage />} />
                <Route path="/demo" element={<Demo />} />
                <Route path="*" element={<div style={{ padding: 16 }}>404</div>} />
            </Routes>
        </>
    );
}
