import React from "react";

function Stat({ label, value, badge }) {
    return (
        <div className="mv-stat">
            <div className="mv-stat-top">
                <span className="mv-stat-label">{label}</span>
                <span className={`mv-badge ${badge?.startsWith("-") ? "neg" : "pos"}`}>{badge}</span>
            </div>
            <div className="mv-stat-value">{value}</div>
        </div>
    );
}

export default function StatCards({ stats = {} }) {
    const {
        totalIn, totalOut, totalSales, totalMovements,
        trendIn, trendOut, trendSales, trendAll,
    } = stats;
    return (
        <div className="mv-stats-grid">
            <Stat label="Total IN" value={totalIn ?? 0} badge={trendIn ?? ""} />
            <Stat label="Total OUT" value={totalOut ?? 0} badge={trendOut ?? ""} />
            <Stat label="Total SALES" value={totalSales ?? 0} badge={trendSales ?? ""} />
            <Stat label="Total Movements" value={totalMovements ?? 0} badge={trendAll ?? ""} />
        </div>
    );
}
