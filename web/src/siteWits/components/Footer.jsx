import React from "react";
import "../assets/styles.css"; // styles du footer

// Footer global (site-wide). Sobre, responsive, accessible.
export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="wits-footer" role="contentinfo">
            <div className="wits-footer__grid">
                {/* Col 1 — Branding / pitch */}
                <div className="wits-footer__col">
                    <h3 className="wits-footer__brand">WITS</h3>
                    <p className="wits-footer__text">
                        Connaissez votre stock sur le bout des doigts. Suivi des produits,
                        mouvements IN/OUT et alertes seuil — clair, fiable, démontrable.
                    </p>
                    <p className="wits-footer__meta">v0.1.0 — MVP académique</p>
                </div>

                {/* Col 2 — Navigation */}
                <nav className="wits-footer__col" aria-label="Navigation principale pied de page">
                    <h4 className="wits-footer__title">Navigation</h4>
                    <ul className="wits-footer__links">
                        <li><a href="#/Home">Accueil</a></li>
                        <li><a href="#/Products">Produits</a></li>
                        <li><a href="#/Movements">Mouvements</a></li>
                        <li><a href="#/About">À propos</a></li>
                        <li><a href="#/Contact">Contact</a></li>
                    </ul>
                </nav>

                {/* Col 3 — Ressources */}
                <div className="wits-footer__col">
                    <h4 className="wits-footer__title">Ressources</h4>
                    <ul className="wits-footer__links">
                        <li><a href="#" aria-disabled="true">README (à publier)</a></li>
                        <li><a href="#" aria-disabled="true">OWASP note (à compléter)</a></li>
                        <li><a href="#" aria-disabled="true">API Docs (bientôt)</a></li>
                        <li><a href="#" aria-disabled="true">CI/CD (GitHub Actions)</a></li>
                    </ul>
                </div>

                {/* Col 4 — Contact */}
                <div className="wits-footer__col">
                    <h4 className="wits-footer__title">Nous contacter</h4>
                    <ul className="wits-footer__contact">
                        <li>📧 contact@wits.local</li>
                        <li>📍 Bruxelles, BE</li>
                        <li>⏱️ Lun–Ven · 9:00–18:00</li>
                    </ul>
                    <div className="wits-footer__social" aria-label="Réseaux sociaux">
                        <a href="#" aria-label="GitHub (bientôt)">GitHub</a>
                        <span>·</span>
                        <a href="#" aria-label="LinkedIn (bientôt)">LinkedIn</a>
                    </div>
                </div>
            </div>

            <div className="wits-footer__bar">
                <span>© {year} WITS.</span>
                <nav aria-label="Liens légaux">
                    <a href="#" aria-disabled="true">Conditions</a>
                    <span>·</span>
                    <a href="#" aria-disabled="true">Confidentialité</a>
                    <span>·</span>
                    <a href="#" aria-disabled="true">Cookies</a>
                </nav>
            </div>
        </footer>
    );
}
