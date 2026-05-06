import React from 'react';

const tickerItems = [
  { symbol: 'AAPL', price: '175.50', change: '+1.2%' },
  { symbol: 'MSFT', price: '310.20', change: '-0.5%' },
  { symbol: 'GOOGL', price: '135.00', change: '+0.8%' },
  { symbol: 'AMZN', price: '140.10', change: '-1.1%' },
  { symbol: 'TSLA', price: '215.30', change: '+2.4%' },
  { symbol: 'META', price: '298.50', change: '+1.5%' },
  { symbol: 'NVDA', price: '450.00', change: '+3.1%' },
  { symbol: 'SPY', price: '450.20', change: '+0.5%' }
];

export default function LiveTicker() {
  return (
    <div className="overflow-hidden whitespace-nowrap border-b-2 border-black bg-gray-100 py-2 relative">
      <div className="inline-block" style={{ animation: 'ticker-scroll 30s linear infinite' }}>
        {tickerItems.map((item, idx) => (
          <span key={idx} className="inline-block mr-8 font-bold text-sm uppercase">
            {item.symbol} ${item.price} ({item.change})
          </span>
        ))}
        {/* Duplicate for seamless scrolling */}
        {tickerItems.map((item, idx) => (
          <span key={`dup-${idx}`} className="inline-block mr-8 font-bold text-sm uppercase">
            {item.symbol} ${item.price} ({item.change})
          </span>
        ))}
      </div>
    </div>
  );
}
