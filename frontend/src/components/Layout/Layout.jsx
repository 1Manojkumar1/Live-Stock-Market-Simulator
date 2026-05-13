import React, { useContext, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { SocketContext } from '../../contexts/SocketContext';
import { AuthContext } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Bell } from 'lucide-react';

const Layout = () => {
    const socket = useContext(SocketContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (socket && user) {
            // Join personal room for targeted notifications
            socket.emit('joinRoom', user._id);

            // Listen for social notifications
            socket.on('socialNotification', (data) => {
                toast((t) => (
                    <div 
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => {
                            toast.dismiss(t.id);
                            navigate(`/profile/${data.traderId}`);
                        }}
                    >
                        <div className="p-2 bg-zinc-900 text-white rounded-lg">
                            <Bell size={16} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-zinc-900">
                                {data.traderName} just {data.action.toLowerCase()}ed {data.stockSymbol}
                            </p>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                                View Profile to Copy
                            </p>
                        </div>
                    </div>
                ), {
                    duration: 5000,
                    position: 'bottom-right',
                    style: {
                        borderRadius: '16px',
                        background: '#fff',
                        color: '#18181b',
                        border: '1px solid #e4e4e7',
                        padding: '12px'
                    }
                });
            });

            return () => {
                socket.off('socialNotification');
            };
        }
    }, [socket, user, navigate]);

    return (
        <div className="h-screen flex flex-col bg-zinc-50 overflow-hidden">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-y-auto w-full">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;