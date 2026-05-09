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
        <div className="relative flex flex-col md:flex-row gap-4 mb-10">
            <div className="relative flex-1 group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-zinc-900 transition-colors">
                    <Search size={18} />
                </div>
                <input
                    type="text"
                    placeholder="Filter market by name or symbol..."
                    value={search}
                    onChange={handleSearchChange}
                    className="block w-full pl-12 pr-12 py-4 border border-gray-100 rounded-[1.5rem] leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-zinc-50 focus:border-zinc-200 sm:text-sm transition-all shadow-sm"
                />
                {search && (
                    <button 
                        onClick={() => { setSearch(''); onSearch({ search: '', category }); }}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-300 hover:text-zinc-900 transition-colors"
                    >
                        <X size={18} />
                    </button>
                )}
            </div>

            <div className="relative w-full md:w-72">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Filter size={16} />
                </div>
                <select
                    value={category}
                    onChange={handleCategoryChange}
                    className="block w-full pl-12 pr-10 py-4 border border-gray-100 rounded-[1.5rem] leading-5 bg-white focus:outline-none focus:ring-4 focus:ring-zinc-50 focus:border-zinc-200 sm:text-sm appearance-none transition-all shadow-sm font-black text-gray-900 cursor-pointer"
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


