import React, { useState } from "react";

export default function TransactionCard() {
    const [tab, setTab] = useState("total");

    return (
        <div>
            <div className="mv-card-head">
                <h3 className="mv-title">Transaction</h3>
                <select className="mv-select" defaultValue="Monthly" disabled>
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                </select>
            </div>

            <div className="mv-tabs">
                <button onClick={() => setTab("total")} className={tab === "total" ? "active" : ""}>Total Transaction</button>
                <button onClick={() => setTab("sales")} className={tab === "sales" ? "active" : ""}>Total Sales</button>
                <button onClick={() => setTab("payment")} className={tab === "payment" ? "active" : ""}>Total Payment</button>
            </div>

            <div className="mv-transaction-body">
                <div className="mv-amount">$11,980</div>
                <div className="mv-linechart-placeholder">line chart ({tab})</div>
                <div className="mv-sparks">
                    <div className="mv-mini">•</div>
                    <div className="mv-mini">•</div>
                    <div className="mv-mini">•</div>
                </div>
            </div>
        </div>
    );
}
