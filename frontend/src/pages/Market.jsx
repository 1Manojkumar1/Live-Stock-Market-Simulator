import React, { useState } from 'react';
import SearchBar from '../components/stocks/SearchBar';
import StockList from '../components/stocks/StockList';

const Market = () => {
    const [filters, setFilters] = useState({});

    return (
        <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-8">
            <header>
                <h1 className="text-2xl font-bold text-zinc-900 tracking-tight uppercase">Live Market</h1>
                <p className="text-sm text-zinc-500 font-medium mt-1">Monitor real-time prices and discover new opportunities.</p>
            </header>

            <div className="space-y-6">
                <SearchBar onSearch={setFilters} />
                <StockList filters={filters} />
            </div>
        </div>
    );
};

export default Market;
