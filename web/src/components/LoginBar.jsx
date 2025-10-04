import React, { useState } from "react";

// Barre de login très simple: stocke un token en localStorage
export default function LoginBar() {
    const [email, setEmail] = useState(localStorage.getItem("wits_user") || "admin@wits.local");
    const [password, setPassword] = useState("");
    const [auth, setAuth] = useState(localStorage.getItem("wits_token") ? "connecté" : "anonyme");

    async function login() {
        try {
            // NOTE: adapte l’URL si tu as câblé /api/login côté products-api
            const res = await fetch(`${import.meta.env.VITE_PRODUCTS_API_URL}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const body = await res.json();
            if (!body?.token) throw new Error("token_absent");
            localStorage.setItem("wits_token", body.token);
            localStorage.setItem("wits_user", email);
            setAuth("connecté");
            alert("Login OK");
        } catch (e) {
            alert("Login KO: " + e.message);
        }
    }

    function logout() {
        localStorage.removeItem("wits_token");
        localStorage.removeItem("wits_user");
        setPassword("");
        setAuth("anonyme");
    }

    return (
        <div className="row" style={{ gap: 8, marginBottom: 12 }}>
            <span>Auth: {auth}</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="mot de passe"
            />
            <button onClick={login}>Login</button>
            <button onClick={logout}>Logout</button>
        </div>
    );
}
