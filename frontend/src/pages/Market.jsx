import React, { useState } from 'react';
import SearchBar from '../components/stocks/SearchBar';
import StockList from '../components/stocks/StockList';

const Market = () => {
    const [filters, setFilters] = useState({});

    return (
        <div className="page-container">
            <h1>STOCK MARKET</h1>
            {/* 
                DESCRIPTION: 
                The browsing page for stocks.
                Renders a SearchBar (to set filters) and a StockList (to display cards).
            */}
            <SearchBar onSearch={setFilters} />
            <StockList filters={filters} />
        </div>
    );
};

export default Market;
