import React, { useContext } from 'react';
import { SocketContext } from '../../contexts/SocketContext';
import TradingModal from '../trading/TradingModal';

const StockCard = ({ stock }) => {
    return (
        <div className="stock-card">
            {/* 
                DESCRIPTION: 
                Individual stock card displaying:
                - Stock Symbol (e.g. RELIANCE) and Name.
                - Live Price with color indicators (Green for Up, Red for Down).
                - Price Change percentage.
                - Buttons for 'Buy', 'Sell', and 'Add to Watchlist'.
            */}
            <p>Component: Card for {stock?.symbol || 'Stock'} with live price and Action buttons.</p>
        </div>
    );
};

export default StockCard;
