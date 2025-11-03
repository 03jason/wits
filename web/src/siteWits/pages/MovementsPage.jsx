import React, { useEffect, useMemo, useState } from "react";
import MostOutProduct from "../components/movements/MostOutProduct.jsx";
import StatCards from "../components/movements/StatCards.jsx";
import MovementsList from "../components/movements/MovementsList.jsx";
import MovementInformation from "../components/movements/MovementInformation.jsx";
import FilterMovements from "../components/movements/FilterMovements.jsx";
import { fetchMovements } from "../api/movements.js";
import "../assets/movements.css";

export default function MovementsPage() {
    const [movements, setMovements] = useState([]);
    const [selected, setSelected] = useState(null);
    const [filters, setFilters] = useState({
        q: "", type: "ALL", from: "", to: "", minQty: "", maxQty: "", by: "", withNote: false,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const resetFilters = () =>
        setFilters({ q: "", type: "ALL", from: "", to: "", minQty: "", maxQty: "", by: "", withNote: false });

    // --- Chargement initial depuis l’API
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const data = await fetchMovements();
                setMovements(data);
            } catch (e) {
                console.error(e);
                setError("Impossible de charger les mouvements");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // --- Application des filtres
    const filteredRows = useMemo(() => {
        const q = filters.q.trim().toLowerCase();
        const t = filters.type.toUpperCase();
        const fromTs = filters.from ? new Date(filters.from + "T00:00:00").getTime() : null;
        const toTs   = filters.to ? new Date(filters.to + "T23:59:59").getTime() : null;
        const minQ   = filters.minQty !== "" ? Number(filters.minQty) : null;
        const maxQ   = filters.maxQty !== "" ? Number(filters.maxQty) : null;
        const by     = filters.by.trim().toLowerCase();
        const withNote = !!filters.withNote;

        return movements.filter((r) => {
            if (t !== "ALL" && String(r.type_code || "").toUpperCase() !== t) return false;
            if (q) {
                const hay = `${r.product_name || ""} ${r.note || ""}`.toLowerCase();
                if (!hay.includes(q)) return false;
            }
            if (fromTs || toTs) {
                const ts = new Date(r.created_at).getTime();
                if (fromTs && ts < fromTs) return false;
                if (toTs && ts > toTs) return false;
            }
            if (minQ !== null && Number(r.quantity) < minQ) return false;
            if (maxQ !== null && Number(r.quantity) > maxQ) return false;
            if (by && !String(r.user_name || "").toLowerCase().includes(by)) return false;
            if (withNote && !r.note) return false;
            return true;
        });
    }, [movements, filters]);

    if (error) {
        return <div className="text-red-600 text-center mt-10">{error}</div>;
    }

    return (
        <div className="mv-grid layout-right">
            <section className="mv-card mv-overview"><MostOutProduct data={{}} /></section>
            <section className="mv-card mv-stats"><StatCards stats={{}} /></section>
            <section className="mv-card mv-filtercard">
                <FilterMovements value={filters} onChange={setFilters} onReset={resetFilters} />
            </section>
            <section className="mv-card mv-list">
                {loading ? (
                    <p className="text-center text-gray-500">Chargement des mouvements...</p>
                ) : (
                    <div className="mv-table-wrap">
                        <MovementsList
                            rows={filteredRows.map((r) => ({
                                id: `MV-${r.movement_id}`,
                                date: r.created_at,
                                product: r.product_name,
                                type: r.type_code,
                                qty: r.quantity,
                                by: r.user_name || "—",
                                note: r.note,
                            }))}
                            onSelect={setSelected}
                            selectedId={selected?.id}
                        />
                    </div>
                )}
            </section>
            <section className="mv-card mv-info">
                <MovementInformation movement={selected} />
            </section>
        </div>
    );
}
