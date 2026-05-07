import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = () => {
    return (
        <div className="app-layout">
            <Navbar />
            <div className="main-content">
                <Sidebar />
                <main className="page-view">
                    {/* 
                        DESCRIPTION: 
                        This is the main wrapper for all authenticated pages.
                        It renders the Navbar at the top and Sidebar on the left.
                        The <Outlet /> renders the specific page (Dashboard, Market, etc.)
                        .
                    */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
