import React, { useState } from 'react';
import api from '../../services/api';

const TradingModal = ({ stock, type, onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="trading-modal">
                {/* 
                    DESCRIPTION: 
                    A modal for executing trades:
                    - Displays current Stock Price.
                    - Input for 'Quantity' (auto-calculates 'Total Amount').
                    - Validation: Checks if Balance is enough (for Buy) or Shares are enough (for Sell).
                    - 'Confirm Trade' button triggers /user-api/buy or /user-api/sell.
                */}
                <p>Component: Buy/Sell form for {stock?.symbol} ({type}).</p>
            </div>
        </div>
    );
};

export default TradingModal;
