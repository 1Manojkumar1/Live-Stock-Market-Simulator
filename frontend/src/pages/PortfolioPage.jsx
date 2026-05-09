import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Portfolio from '../components/dashboard/Portfolio';
import WalletCard from '../components/dashboard/WalletCard';

const PortfolioPage = () => {
    const { user } = useContext(AuthContext);
    const userId = user?.id || user?._id;

    return (
        <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-10">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">My Portfolio</h1>
                    <p className="text-gray-500 font-medium mt-1">Manage your holdings and track your performance.</p>
                </div>
                <div className="w-full md:w-auto">
                    <WalletCard />
                </div>
            </header>

            <div className="w-full">
                <Portfolio userId={userId} />
            </div>
        </div>
    );
};

export default PortfolioPage;
