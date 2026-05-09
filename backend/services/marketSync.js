export const apiStatus = {
    remaining: 60,
    limit: 60,
    reset: 0,
    lastUpdate: Date.now()
};

const getFinnhubQuote = async (symbol) => {
    const apiKey = process.env.FINNHUB_API_KEY;
    const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${apiKey}`;
    const response = await fetch(url);
    
    // Capture rate limits
    if (response.headers.get('x-ratelimit-remaining')) {
        apiStatus.remaining = parseInt(response.headers.get('x-ratelimit-remaining'));
        apiStatus.limit = parseInt(response.headers.get('x-ratelimit-limit'));
        apiStatus.reset = parseInt(response.headers.get('x-ratelimit-reset'));
        apiStatus.lastUpdate = Date.now();
    }

    if (!response.ok) {
        throw new Error(`Finnhub request failed: ${response.status}`);
    }
    return await response.json(); // { c: current, h: high, l: low, ... }
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));


export const syncRealMarketPrices = async (io) => {
    try {
        const stocks = await stockModel.find();
        console.log(`Syncing ${stocks.length} stocks...`);
        
        for (const stock of stocks) {
            try {
                const data = await getFinnhubQuote(stock.symbol);
                if (!data || data.c === 0) continue; // Skip if no data

                const newPrice = data.c;
                const oldPrice = stock.price;
                const priceChange = data.d || (newPrice - oldPrice);

                stock.price = newPrice;
                stock.priceChange = priceChange;
                
                // Limit history to last 50 points to save space
                if (stock.priceHistory.length > 50) {
                    stock.priceHistory.shift();
                }
                stock.priceHistory.push({ price: newPrice, timestamp: new Date() });
                
                await stock.save();

                io.emit('stockPriceUpdate', {
                    stockId: stock._id,
                    symbol: stock.symbol,
                    newPrice,
                    priceChange,
                    timestamp: new Date()
                });

                // Respect Finnhub rate limits (60/min)
                // If we have many stocks, we need to slow down
                await sleep(1000); 

            } catch (err) {
                console.error(`Failed to sync ${stock.symbol}:`, err.message);
            }
        }
    } catch (err) {
        console.error('Error in syncRealMarketPrices:', err);
    }
};


export const seedPopularStocks = async () => {
    const popularSymbols = [
        'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX', 'TSM', 'ASML',
        'ADBE', 'AVGO', 'COST', 'PEP', 'CSCO', 'TMUS', 'TXN', 'INTC', 'QCOM', 'AMD',
        'AMAT', 'INTU', 'MU', 'HON', 'AMGN', 'SBUX', 'MDLZ', 'ISRG', 'GILD', 'BKNG'
    ];

    console.log('Checking for popular stocks to seed...');
    for (const symbol of popularSymbols) {
        try {
            const existing = await stockModel.findOne({ symbol });
            if (!existing) {
                console.log(`Seeding ${symbol}...`);
                const apiKey = process.env.FINNHUB_API_KEY;
                
                // Quote
                const qRes = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`);
                const qData = await qRes.json();
                
                // Profile
                const pRes = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${apiKey}`);
                const pData = await pRes.json();

                if (qData.c) {
                    await stockModel.create({
                        stockid: `STK-${Date.now()}-${symbol}`,
                        stockName: pData.name || symbol,
                        symbol: symbol.toUpperCase(),
                        price: qData.c,
                        priceChange: qData.d || 0,
                        category: pData.finnhubIndustry || "Technology",
                        logo: pData.logo,
                        priceHistory: [{ price: qData.c, timestamp: new Date() }]
                    });
                    // Small delay to respect rate limit during seeding
                    await sleep(500);
                }
            }
        } catch (err) {
            console.error(`Failed to seed ${symbol}:`, err.message);
        }
    }
    console.log('Seeding process completed.');
};

export const startPriceSync = (io) => {
    console.log('Real-time Market Sync Started...');
    // Initial Seed
    seedPopularStocks();
    // Start interval
    setInterval(() => syncRealMarketPrices(io), 60000);
};

