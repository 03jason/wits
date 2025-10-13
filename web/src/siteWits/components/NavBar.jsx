import React from "react";
import { NavLink } from "react-router-dom";

/**
 * Props:
 *  - user: { name: "Jason Rasri" } | null  -> si présent, on affiche les initiales
 */
export default function NavBar({ user = null }) {
    const activeClass = ({ isActive }) =>
        "navlink" + (isActive ? " navlink--active" : "");



    // TODO logique plus tard : isLoggedIn / initials
    const isLoggedIn = false;
    const initials = "JW";


    return (
        <header className="navbar">
            <div className="navbar__inner">
                {/* Marque / Titre (pas un lien) */}
                <div className="navbar__brand">WITS</div>

                {/* Liens (poussés à droite) */}
                <nav className="navbar__links">
                    <NavLink to="/home" className={activeClass}>Accueil</NavLink>
                    <NavLink to="/productList" className={activeClass}>Produits</NavLink>
                    <NavLink to="/movements" className={activeClass}>Mouvements</NavLink>
                    <NavLink to="/test" className={activeClass}>Page test</NavLink>
                    <NavLink to="/demo" className={activeClass}>Demo</NavLink>
                    <NavLink to="/aboutUs" className={activeClass}>À propos</NavLink>
                    {/* <NavLink to="/contact" className={activeClass}>Contact</NavLink> */}
                </nav>

                {/* Actions (login / avatar) */}
                <div className="navbar__actions">
                    {user ? (
                        <span className="navbar__avatar" title={user.name}>
              {initials || "U"}
            </span>
                    ) : (
                        <NavLink to="/login" className="navbar__loginBtn">
                            Login
                        </NavLink>
                    )}
                </div>
            </div>
        </header>
    );
}
