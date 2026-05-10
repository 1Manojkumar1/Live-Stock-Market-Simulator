import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Portfolio from '../components/dashboard/Portfolio';
import WalletCard from '../components/dashboard/WalletCard';

const PortfolioPage = () => {
    const { user } = useContext(AuthContext);
    const userId = user?.id || user?._id;

    return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-8">
        <header>
            <h1 className="text-xl font-bold text-zinc-900 tracking-tight uppercase">My Portfolio</h1>
            <p className="text-zinc-500 text-[11px] font-medium mt-0.5">Manage holdings and performance tracking.</p>
        </header>

        <div className="w-full">
            <Portfolio userId={userId} />
        </div>
    </div>
    );
};

export default PortfolioPage;
