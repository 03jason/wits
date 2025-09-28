import React from 'react';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import MovementForm from './components/MovementForm';
import LoginBar from './components/LoginBar';

export default function App() {
    const reloadList = () => window.location.reload();

    return (
        <>
            <header>
                <h2 style={{ margin: 0 }}>WITS – Gestion de stock</h2>
                <span className="badge">Demo</span>
            </header>

            <div className="container">
                <LoginBar />
                {/* ProductForm, MovementForm, ProductList */}
                <ProductForm onCreated={reloadList} />
                <MovementForm onRecorded={reloadList} />
                <ProductList onSelect={(p) => alert(`Produit #${p.product_id}: ${p.product_name}`)} />
            </div>
        </>
    );
}
