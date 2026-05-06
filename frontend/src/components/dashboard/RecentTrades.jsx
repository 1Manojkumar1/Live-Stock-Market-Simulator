import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const RecentTrades = ({ userId }) => {
    return (
        <div className="recent-trades-container">
            {/* 
                DESCRIPTION: 
                Fetch the last 5-10 transactions from /user-api/transactions/:userId.
                Shows:
                - Type (BUY/SELL) with color badge.
                - Stock Symbol.
                - Quantity & Execution Price.
                - Date & Time.
            */}
            <p>Component: List of recently completed buy/sell transactions.</p>
        </div>
    );
};

export default RecentTrades;
