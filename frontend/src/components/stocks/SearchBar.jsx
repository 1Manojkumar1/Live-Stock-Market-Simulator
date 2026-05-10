import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import api from '../../services/api';

const SearchBar = ({ onSearch }) => {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);

    // Fetch dynamic categories from the market
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/stock-api/categories');
                setCategories(res.data.categories || []);
            } catch (err) {
                console.error("Failed to fetch categories", err);
            }
        };
        fetchCategories();
    }, []);

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearch(val);
        onSearch({ search: val, category });
    };

    const handleCategoryChange = (e) => {
        const val = e.target.value;
        setCategory(val);
        onSearch({ search, category: val });
    };

    return (
        <div className="relative flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1 group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-zinc-900 transition-colors">
                    <Search size={16} />
                </div>
                <input
                    type="text"
                    placeholder="Filter market by name or symbol..."
                    value={search}
                    onChange={handleSearchChange}
                    className="block w-full pl-10 pr-10 py-2.5 border border-zinc-200 rounded-lg text-sm bg-white placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 transition-all shadow-sm"
                />
                {search && (
                    <button 
                        onClick={() => { setSearch(''); onSearch({ search: '', category }); }}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-300 hover:text-zinc-900 transition-colors"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            <div className="relative w-full md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                    <Filter size={14} />
                </div>
                <select
                    value={category}
                    onChange={handleCategoryChange}
                    className="block w-full pl-10 pr-10 py-2.5 border border-zinc-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900 appearance-none transition-all shadow-sm font-bold text-zinc-900 cursor-pointer"
                >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default SearchBar;


