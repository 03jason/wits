import React from "react";
import "../assets/styles.css"; // (voir le CSS plus bas)

export default function AddProductPage() {
    return (
        <main className="about">
            {/* Bandeau titre */}
            <section className="about__hero">
                <div className="about__container">
                    <h1>À propos de ce projet</h1>
                    <p className="about__subtitle">
                        WITS – un petit outil pour garder votre stock sous contrôle.
                    </p>
                </div>
            </section>

            {/* Zone de contenu plus foncée */}
            <section className="about__content">
                <div className="about__container">
                    <h2>Pourquoi ce projet ?</h2>
                    <p>
                        Ceci est un texte de remplissage. Remplacez-le par votre description :
                        objectifs, périmètre, décisions techniques, et ce qui reste à faire.
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer a
                        felis eget metus convallis dictum. Sed non urna sit amet mi
                        efficitur hendrerit. Proin euismod, dolor sit amet aliquam iaculis,
                        purus mauris commodo augue, in rhoncus augue orci eu orci. Cras
                        posuere, ante id semper feugiat, neque dui venenatis augue, at
                        facilisis nibh ligula vitae nisl. Vivamus consequat, erat sed
                        dignissim interdum, velit justo interdum augue, vitae congue ipsum
                        neque nec sapien.
                    </p>
                </div>
            </section>
        </main>
    );
}
