// web/src/App.jsx
import React, { useState } from 'react';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import MovementForm from './components/MovementForm';
import LoginBar from './components/LoginBar';

export default function App() {
    const [refreshKey, setRefreshKey] = useState(0);
    const refresh = () => setRefreshKey(k => k + 1); // 🔁 trigger UI reload

    return (
        <>
            <header>
                <h2 style={{margin:0}}>WITS – Gestion de stock</h2>
                <span className="badge">Demo</span>
            </header>

            <div className="container">
                <LoginBar />
                <ProductForm onCreated={refresh} />
                <MovementForm onRecorded={refresh} />
                <ProductList refreshKey={refreshKey}
                             onSelect={(p)=>alert(`Produit #${p.product_id}: ${p.product_name}`)} />
            </div>
        </>
    );
}
