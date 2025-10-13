import React from "react";

export default function MostOutProduct({ data }) {
    const { productName, code, totalOut, periodLabel } = data || {};
    return (
        <div className="mv-overview-wrap">
            <div>
                <h3 className="mv-title">Most OUT Product</h3>
                <p className="mv-muted">{periodLabel}</p>
                <div className="mv-kpi">
                    <span className="mv-kpi-value">{totalOut ?? "-"}</span>
                    <span className="mv-kpi-unit"> sorties</span>
                </div>
                <p className="mv-product">
                    <strong>{productName ?? "—"}</strong>
                    {code ? <span className="mv-code"> • {code}</span> : null}
                </p>
            </div>

            {/* zone graphique placeholder */}
            <div className="mv-spark">
                <div className="mv-spark-placeholder">graph</div>
            </div>
        </div>
    );
}
