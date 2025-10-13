import React, { useMemo, useState } from "react";
import MostOutProduct from "../components/movements/MostOutProduct.jsx";
import StatCards from "../components/movements/StatCards.jsx";
import MovementsList from "../components/movements/MovementsList.jsx";
import MovementInformation from "../components/movements/MovementInformation.jsx";
import FilterMovements from "../components/movements/FilterMovements.jsx";

import "../assets/movements.css";

export default function MovementsPage() {
    const [selected, setSelected] = useState(null);
    const [filters, setFilters] = useState({
        q: "",
        type: "ALL",
        from: "",
        to: "",
        minQty: "",
        maxQty: "",
        by: "",
        withNote: false,
    });

    const resetFilters = () =>
        setFilters({ q: "", type: "ALL", from: "", to: "", minQty: "", maxQty: "", by: "", withNote: false });

    // --- Données démo (inchangé, on ajoute juste un DATA avec diff)
    const fakeMovements = useMemo(() => {
        const base = Array.from({ length: 18 }).map((_, i) => ({
            id: `MV-${2450 + i}`,
            date: `2025-09-${String(18 + (i % 10)).padStart(2, "0")} 14:${String(20 + i).padStart(2, "0")}`,
            product: i % 2 ? "Souris Pro X" : "Clavier MK-720",
            type: i === 3 ? "DATA" : i % 3 === 0 ? "OUT" : i % 3 === 1 ? "IN" : "SALES",
            qty: i % 2 ? 3 : 1,
            by: i % 2 ? "jason" : "admin",
            note: i % 3 === 0 ? "Commande web" : "",
        }));
        return base.map((row) =>
            row.type === "DATA"
                ? {
                    ...row,
                    diff: [
                        { field: "price", before: 14.9, after: 12.9 },
                        { field: "brand", before: "NoName", after: "LogiTech" },
                        { field: "min_threshold", before: 2, after: 5 },
                    ],
                }
                : row
        );
    }, []);

    // --- Application des filtres (côté front)
    const filteredRows = useMemo(() => {
        const q = filters.q.trim().toLowerCase();
        const t = filters.type.toUpperCase();
        const fromTs = filters.from ? new Date(filters.from + "T00:00:00").getTime() : null;
        const toTs   = filters.to ? new Date(filters.to + "T23:59:59").getTime() : null;
        const minQ   = filters.minQty !== "" ? Number(filters.minQty) : null;
        const maxQ   = filters.maxQty !== "" ? Number(filters.maxQty) : null;
        const by     = filters.by.trim().toLowerCase();
        const withNote = !!filters.withNote;

        return fakeMovements.filter((r) => {
            // type
            if (t !== "ALL" && String(r.type).toUpperCase() !== t) return false;

            // recherche texte: produit + note
            if (q) {
                const hay = `${r.product} ${r.note || ""}`.toLowerCase();
                if (!hay.includes(q)) return false;
            }

            // dates
            if (fromTs || toTs) {
                const ts = new Date(r.date.replace(" ", "T")).getTime();
                if (fromTs && ts < fromTs) return false;
                if (toTs && ts > toTs) return false;
            }

            // quantité
            if (minQ !== null && Number(r.qty) < minQ) return false;
            if (maxQ !== null && Number(r.qty) > maxQ) return false;

            // opérateur
            if (by && !String(r.by || "").toLowerCase().includes(by)) return false;

            // avec note
            if (withNote && !r.note) return false;

            return true;
        });
    }, [fakeMovements, filters]);

    const fakeMostOut = {
        productName: "Glace au chocolat",
        code: "SKU-GLACE-CHOC",
        totalOut: 142,
        periodLabel: "30 derniers jours",
    };

    const fakeStats = {
        totalIn: 910,
        totalOut: 760,
        totalSales: 384,
        totalMovements: 1785,
        trendIn: "+8.2%",
        trendOut: "-1.5%",
        trendSales: "+3.1%",
        trendAll: "+0.9%",
    };


    return (
        <div className="mv-grid layout-right">
            {/* A — Most OUT Product */}
            <section className="mv-card mv-overview" aria-label="Most OUT Product">
                <MostOutProduct data={fakeMostOut} />
            </section>

            {/* B — Stats */}
            <section className="mv-card mv-stats" aria-label="Stats">
                <StatCards stats={fakeStats} />
            </section>

            {/* NEW — Carte filtre indépendante (séparée de la liste) */}
            <section className="mv-card mv-filtercard" aria-label="Filtres mouvements">
                <FilterMovements value={filters} onChange={setFilters} onReset={resetFilters} />
            </section>


            {/* C — Liste */}
            <section className="mv-card mv-list" aria-label="Derniers mouvements">
                <div className="mv-table-wrap">
                    <MovementsList
                        rows={filteredRows}
                        onSelect={setSelected}
                        selectedId={selected?.id}
                    />
                </div>
            </section>

            {/* D/E — Panneau d’info */}
            <section className="mv-card mv-info" aria-label="Informations mouvement">
            <MovementInformation movement={selected} />
            </section>
        </div>
    );

}
