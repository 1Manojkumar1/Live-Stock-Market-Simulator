import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import StockCard from './StockCard';

const StockList = ({ filters }) => {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStocks = async () => {
            try {
                setLoading(true);
                const queryParams = new URLSearchParams(filters).toString();
                const res = await api.get(`/stock-api/stocks?${queryParams}`);
                setStocks(res.data.stocks);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching stocks:', err);
                setError('Failed to load stocks. Please try again.');
                setLoading(false);
            }
        };

        fetchStocks();
    }, [filters]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 text-red-600 p-6 rounded-xl text-center my-10">
                {error}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
            {stocks.length > 0 ? (
                stocks.map((stock) => (
                    <StockCard key={stock._id} stock={stock} />
                ))
            ) : (
                <div className="col-span-full text-center py-20 text-gray-500">
                    No stocks found matching your criteria.
                </div>
            )}
        </div>
    );
};

export default StockList;
