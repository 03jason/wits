// web/src/siteWits/pages/Page.jsx
import { Link } from "react-router-dom";
import React, { useRef, useState } from "react";
import LoginBar from "../../components/LoginBar.jsx";
import ProductForm from "../../components/ProductForm.jsx";
import MovementForm from "../../components/MovementForm.jsx";
import ProductList from "../../components/ProductList.jsx";

import ProductsPage from "./ProductsPage.jsx";

export default function HomePage() {

    // (facultatif) petit état pour le formulaire de contact
    const [form, setForm] = useState({
        firstname: "",
        email: "",
        subject: "",
        message: "",
    });

    const onChange = (e) =>
        setForm((f) => ({...f, [e.target.name]: e.target.value}));

    const onSubmit = (e) => {
        e.preventDefault();
        // Ici, tu pourras brancher un service (email, API, etc.)
        alert("Message envoyé (demo).");
        setForm({firstname: "", email: "", subject: "", message: ""});
    };


    return (
        <>
            <title>Wits Acceuil</title>

            <div className="container">


                <main className="home">
                    {/* ==== HERO / Vitrine ==== */}
                    {/* Le header global du site sera rendu au-dessus depuis App.jsx */}
                    <section className="hero" aria-labelledby="home-hero-title">
                        <div className="hero__container">
                            <h1 id="home-hero-title" className="hero__title">
                                Connaissez votre stock sur le bout des doigts
                            </h1>

                            <div className="hero__grid" role="navigation" aria-label="Accès rapide">
                                <Link to="/productList" className="hero-card card--products">
                                    <span className="hero-card__kicker">Aller à</span>
                                    <span className="hero-card__title">PRODUITS</span>
                                </Link>

                                <Link to="/movements" className="hero-card card--movements">
                                    <span className="hero-card__kicker">Aller à</span>
                                    <span className="hero-card__title">MOUVEMENTS</span>
                                </Link>

                                <Link to="/more" className="hero-card card--more">
                                    <span className="hero-card__kicker">Découvrir</span>
                                    <span className="hero-card__title">MORE</span>
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* ==== À PROPOS ==== */}
                    <section className="about" aria-labelledby="about-title">
                        <div className="about__container">
                            <h2 id="about-title" className="about__title">
                                À propos du projet
                            </h2>
                            <p className="about__text">
                                WITS est une démonstration d’application de gestion de stock conçue
                                pour être simple, rapide et didactique. Vous pouvez consulter votre
                                catalogue produits, suivre les entrées/sorties (mouvements) et
                                garder un œil sur les seuils critiques. L’objectif : visualiser vos
                                données en un coup d’œil et gagner du temps sur les opérations
                                courantes.
                            </p>
                            <div className="about__cta">
                                <Link to="/aboutUs" className="btn btn--primary">
                                    Plus d’info
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* ==== CONTACT (sans carte) ==== */}
                    <section className="contact" aria-labelledby="contact-title">
                        <div className="contact__container">
                            <h2 id="contact-title" className="contact__title">
                                Contact
                            </h2>

                            <form className="contact__form" onSubmit={onSubmit}>
                                <div className="form-row">
                                    <div className="form-field">
                                        <label htmlFor="firstname">Prénom</label>
                                        <input
                                            id="firstname"
                                            name="firstname"
                                            type="text"
                                            value={form.firstname}
                                            onChange={onChange}
                                            placeholder="Votre prénom"
                                            autoComplete="given-name"
                                        />
                                    </div>

                                    <div className="form-field">
                                        <label htmlFor="email">E-mail *</label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            value={form.email}
                                            onChange={onChange}
                                            placeholder="vous@exemple.com"
                                            autoComplete="email"
                                        />
                                    </div>
                                </div>

                                <div className="form-field">
                                    <label htmlFor="subject">Objet</label>
                                    <input
                                        id="subject"
                                        name="subject"
                                        type="text"
                                        value={form.subject}
                                        onChange={onChange}
                                        placeholder="Sujet du message"
                                    />
                                </div>

                                <div className="form-field">
                                    <label htmlFor="message">Message *</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        required
                                        rows={6}
                                        value={form.message}
                                        onChange={onChange}
                                        placeholder="Votre message…"
                                    />
                                </div>

                                <div className="form-actions">
                                    <button type="submit" className="btn btn--primary">
                                        Envoyer
                                    </button>
                                </div>
                            </form>
                        </div>
                    </section>
                </main>

            </div>
        </>


    )
        ;
}


