import React, { useRef, useState } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";

// Composant
import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";
import MovementForm from "./components/MovementForm";
import LoginBar from "./components/LoginBar";
import NavBar from "./siteWits/components/NavBar.jsx";
/// Composant qui aide pour localiser et séparer élement
import { useLocation } from "react-router-dom";
import Footer from "./siteWits/components/Footer.jsx"

// Les pages
import HomePage from "./siteWits/pages/HomePage.jsx";
import TestPage from "./siteWits/pages/TestPage.jsx";
import LoginPage from "./siteWits/pages/LoginPage.jsx";
import ProductsPage from "./siteWits/pages/ProductsPage.jsx";
import MovementsPage from "./siteWits/pages/MovementsPage.jsx";
import EditProductPage from "./siteWits/pages/EditProductPage.jsx";
import AboutUsPage from "./siteWits/pages/AboutUsPage.jsx";
import ContactPage from "./siteWits/pages/ContactPage.jsx";
import AddProductPage from "./siteWits/pages/AddProductPage.jsx";





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



            {/* Nav globale - DOIT être à l'intérieur d’un Router (ici oui, car <HashRouter> est dans main.jsx) */}
            <nav style={{ padding: 12, borderBottom: "1px solid #1f2937" }}>
                <Link to="/home" style={{ marginRight: 12 }}>Home</Link>
                <Link to="/test" style={{ marginRight: 12 }}>TestPage</Link>
                <Link to="/demo">Demo (Produits/Mouvements)</Link>
            </nav>

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

    const { pathname } = useLocation();
    const showNav = pathname !== "/login"; // adapte si HashRouter: le pathname reste "/login"

    return (
        <>


            {/* Enlever le commentaire montre une session active pour l'exemple */}
            {showNav && <NavBar /*user={{ name: "Jason Rasri" }} */ />}


            <Routes>
                {/* Redirige la racine vers /demo pour garder ton écran actuel par défaut */}
                <Route path="/" element={<Navigate to="/demo" replace />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/test" element={<TestPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/demo" element={<Demo />} />
                <Route path="*" element={<div style={{ padding: 16 }}>404</div>} />
                <Route path="/productList" element={<ProductsPage />} />
                <Route path="/movements" element={<MovementsPage />} />
                <Route path="/editProduct" element={<EditProductPage />} />
                <Route path="/aboutUs" element={<AboutUsPage />} />
                <Route path="/addProduct" element={<AddProductPage />} />
                <Route path="/contact" element={<ContactPage />} />

            </Routes>

            <Footer/>

        </>
    );
}
