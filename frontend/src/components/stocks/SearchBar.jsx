import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';

const SearchBar = ({ onSearch }) => {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');

    const handleSearch = (e) => {
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
        <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Search size={20} />
                </div>
                <input
                    type="text"
                    placeholder="Search stocks by name or symbol..."
                    value={search}
                    onChange={handleSearch}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-2xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent sm:text-sm transition-all shadow-sm"
                />
            </div>

            <div className="relative w-full md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Filter size={18} />
                </div>
                <select
                    value={category}
                    onChange={handleCategoryChange}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-2xl leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent sm:text-sm appearance-none transition-all shadow-sm"
                >
                    <option value="">All Categories</option>
                    <option value="Technology">Technology</option>
                    <option value="Finance">Finance</option>
                    <option value="Energy">Energy</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Consumer">Consumer</option>
                </select>
            </div>
        </div>
    );
};

export default SearchBar;
