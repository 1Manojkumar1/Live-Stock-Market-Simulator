import React from 'react';

const myStocks = [
  { id: 1, ticker: 'AAPL', shares: 150, price: 175.50, change: '+1.2%', isPositive: true },
  { id: 2, ticker: 'MSFT', shares: 200, price: 310.20, change: '-0.5%', isPositive: false },
  { id: 3, ticker: 'GOOGL', shares: 50, price: 135.00, change: '+0.8%', isPositive: true },
  { id: 4, ticker: 'AMZN', shares: 100, price: 140.10, change: '-1.1%', isPositive: false },
  { id: 5, ticker: 'TSLA', shares: 75, price: 215.30, change: '+2.4%', isPositive: true },
];

export default function MyStocksTable() {
  return (
    <div className="border-2 border-black p-6 mb-8">
      <h2 className="text-lg font-bold uppercase border-b-2 border-black pb-4 mb-4">My Stocks</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left py-4 px-2 border-b-2 border-black font-bold uppercase text-sm">Ticker</th>
              <th className="text-left py-4 px-2 border-b-2 border-black font-bold uppercase text-sm">Shares</th>
              <th className="text-left py-4 px-2 border-b-2 border-black font-bold uppercase text-sm">Price</th>
              <th className="text-left py-4 px-2 border-b-2 border-black font-bold uppercase text-sm">Value</th>
              <th className="text-left py-4 px-2 border-b-2 border-black font-bold uppercase text-sm">Change</th>
            </tr>
          </thead>
          <tbody>
            {myStocks.map((stock) => (
              <tr key={stock.id} className="transition-colors duration-200 hover:bg-gray-100 last:*:border-b-0">
                <td className="py-4 px-2 border-b border-black font-extrabold">{stock.ticker}</td>
                <td className="py-4 px-2 border-b border-black font-medium">{stock.shares}</td>
                <td className="py-4 px-2 border-b border-black font-medium">${stock.price.toFixed(2)}</td>
                <td className="py-4 px-2 border-b border-black font-medium">${(stock.shares * stock.price).toFixed(2)}</td>
                <td className={`py-4 px-2 border-b border-black font-bold ${stock.isPositive ? "before:content-['+']" : ""}`}>
                  {stock.change}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
