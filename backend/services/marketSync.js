import { stockModel } from '../models/stock.js';
import fetch from 'node-fetch';

const getFinnhubQuote = async (symbol) => {
    const apiKey = process.env.FINNHUB_API_KEY;
    const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Finnhub request failed: ${response.status}`);
    }
    return await response.json(); // { c: current, h: high, l: low, ... }
};

export const syncRealMarketPrices = async (io) => {
    try {
        const stocks = await stockModel.find();
        for (const stock of stocks) {
            try {
                const data = await getFinnhubQuote(stock.symbol);
                const newPrice = data.c; // current price
                const oldPrice = stock.price;
                const priceChange = newPrice - oldPrice;

                stock.price = newPrice;
                stock.priceChange = priceChange;
                stock.priceHistory.push({ price: newPrice, timestamp: new Date() });
                await stock.save();

                io.emit('stockPriceUpdate', {
                    stockId: stock._id,
                    symbol: stock.symbol,
                    newPrice,
                    priceChange,
                    timestamp: new Date()
                });
            } catch (err) {
                console.error(`Failed to sync ${stock.symbol}:`, err.message);
            }
        }
    } catch (err) {
        console.error('Error in syncRealMarketPrices:', err);
    }
};

export const startPriceSync = (io) => {
    console.log('Real-time Market Sync Started...');
    setInterval(() => syncRealMarketPrices(io), 60000);
};
