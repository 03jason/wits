import React from "react";
import { NavLink } from "react-router-dom";

/**
 * Barre de navigation principale.
 * - Utilise NavLink pour le styling "actif".
 * - Minimaliste, réutilisable.
 */
export default function NavBar() {
    const linkBase = "px-3 py-2 rounded hover:underline";
    const active = ({ isActive }) =>
        `${linkBase} ${isActive ? "bg-gray-800 text-white" : "text-gray-200"}`;

    return (
        <header style={{ background: "#0f172a", borderBottom: "1px solid #1f2937" }}>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 16px",
                    color: "#e5e7eb",
                }}
            >
                {/* Logo / titre */}
                <div style={{ fontWeight: 700, letterSpacing: 0.5 }}>WITS</div>

                {/* Liens */}
                <nav style={{ display: "flex", gap: 8 }}>
                    <NavLink to="/home" className={active}>Home</NavLink>
                    <NavLink to="/productList" className={active}>Products</NavLink>
                    <NavLink to="/movementList" className={active}>Movements</NavLink>
                    <NavLink to="/test" className={active}>Test</NavLink>
                    <NavLink to="/demo" className={active}>Demo</NavLink>
                    <NavLink to="/aboutUs" className={active}>About</NavLink>
                    <NavLink to="/contact" className={active}>Contact</NavLink>
                </nav>

                {/* Spacer */}
                <div style={{ marginLeft: "auto" }} />

                {/* Actions (ex: login) */}
                <div style={{ display: "flex", gap: 8 }}>
                    <NavLink to="/login" className={active}>Login</NavLink>
                </div>
            </div>
        </header>
    );
}
