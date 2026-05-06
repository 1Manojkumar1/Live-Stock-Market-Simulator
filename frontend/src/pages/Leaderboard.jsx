import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Leaderboard = () => {
    return (
        <div className="page-container">
            <h1>TRADING LEADERBOARD</h1>
            {/* 
                DESCRIPTION: 
                Fetches top 10 traders from /user-api/leaderboard.
                Shows:
                - Rank (1, 2, 3...).
                - Trader Name.
                - Total Profit in ₹.
                - Number of Trades.
            */}
            <p>Page: Ranking table of users by profit.</p>
        </div>
    );
};

export default Leaderboard;
