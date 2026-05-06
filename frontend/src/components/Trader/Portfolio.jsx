import React, { useContext } from 'react';
import { TradingContext } from '../context/TradingContext';

export default function PortfolioSummary() {
  const { balance } = useContext(TradingContext);

  return (
    <div className="border-2 border-black p-8 mb-8 text-center">
      <div className="text-lg font-semibold uppercase mb-2">Available Balance</div>
      <div className="text-5xl font-black tracking-tight">${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
    </div>
  );
}
