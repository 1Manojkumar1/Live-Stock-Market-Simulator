import React from 'react';

const marketData = [
  { id: 1, name: 'S&P 500', price: 4500.20, change: '+0.5%', isPositive: true },
  { id: 2, name: 'Dow Jones', price: 34500.10, change: '-0.2%', isPositive: false },
  { id: 3, name: 'NASDAQ', price: 14000.50, change: '+0.8%', isPositive: true },
  { id: 4, name: 'Russell 2000', price: 1900.80, change: '-0.1%', isPositive: false },
];

export default function MarketOverview() {
  return (
    <div className="border-2 border-black p-6 mb-8">
      <h2 className="text-lg font-bold uppercase border-b-2 border-black pb-4 mb-4">Market Overview</h2>
      <ul className="list-none">
        {marketData.map((item) => (
          <li key={item.id} className="flex justify-between items-center py-4 px-2 border-b border-black last:border-b-0">
            <span className="font-extrabold">{item.name}</span>
            <div className="text-right">
              <span className="font-bold block">{item.price.toFixed(2)}</span>
              <span className={`text-sm font-semibold ${item.isPositive ? "font-bold before:content-['+']" : "font-bold"}`}>
                {item.change}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
