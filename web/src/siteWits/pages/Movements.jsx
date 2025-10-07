// web/src/siteWits/pages/Home.jsx
import { Link } from "react-router-dom";
import React, { useRef, useState } from "react";
import LoginBar from "../../components/LoginBar.jsx";
import ProductForm from "../../components/ProductForm.jsx";
import MovementForm from "../../components/MovementForm.jsx";
import ProductList from "../../components/ProductList.jsx";

export default function Movements() {


    return (
        <>
            <header>
                <h2 style={{ margin: 0 }}>Liste mouvements</h2>
                <span className="badge">Demo</span>
            </header>

            <div className="container">
                <LoginBar />

                <h1> Liste de tout les Mouvements</h1>

            </div>
        </>


    );
}
