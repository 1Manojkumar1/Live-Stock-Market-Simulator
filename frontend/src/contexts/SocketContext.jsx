import { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Connect to the backend server
        const newSocket = io(import.meta.env.VITE_API_URL, {
            withCredentials: true,
            transports: ['websocket']
        });

        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to Live Stock Server:', newSocket.id);
        });

        // Cleanup on unmount
        return () => newSocket.close();
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
