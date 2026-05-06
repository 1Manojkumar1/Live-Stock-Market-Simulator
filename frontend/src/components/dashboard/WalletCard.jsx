import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const WalletCard = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="wallet-card">
            {/* 
                DESCRIPTION: 
                Shows:
                - "Available Wallet Balance" (formatted as ₹).
                - Total Net Worth (Balance + Portfolio Value).
                - "Add Funds" button to open the deposit modal.
            */}
            <p>Component: Displays wallet balance and net worth overview.</p>
        </div>
    );
};

export default WalletCard;
