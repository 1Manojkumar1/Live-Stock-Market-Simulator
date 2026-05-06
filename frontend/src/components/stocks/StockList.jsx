import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import StockCard from './StockCard';

const StockList = ({ filters }) => {
    return (
        <div className="stock-list-grid">
            {/* 
                DESCRIPTION: 
                A grid container that fetches all available stocks from /stock-api/stocks.
                It maps through the array and renders a <StockCard /> for every stock.
                Automatically re-renders when 'filters' (search/category) change.
            */}
            <p>Component: Grid displaying list of StockCard components based on search/category.</p>
        </div>
    );
};

export default StockList;
