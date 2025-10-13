import React from "react";

export default function TransactionView() {
    return (
        <div>
            <h3 className="mv-title">Transaction View</h3>
            <div className="mv-donut">
                <div className="mv-donut-hole">11,980</div>
                {/* cercles de couleur (placeholder) */}
                <div className="mv-donut-ring ring-a" />
                <div className="mv-donut-ring ring-b" />
                <div className="mv-donut-ring ring-c" />
            </div>

            <ul className="mv-legend">
                <li><span className="dot dot-a" /> Transaction</li>
                <li><span className="dot dot-b" /> Total Sales</li>
                <li><span className="dot dot-c" /> Payment</li>
            </ul>
        </div>
    );
}
