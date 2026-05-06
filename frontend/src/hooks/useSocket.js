import { useContext } from 'react';
import { SocketContext } from '../contexts/SocketContext';

export const useSocket = () => {
    // DESCRIPTION: 
    // A custom hook that provides access to the Socket.io connection.
    // Use this in components (like StockCard) to listen for live price updates.
    return useContext(SocketContext);
};
