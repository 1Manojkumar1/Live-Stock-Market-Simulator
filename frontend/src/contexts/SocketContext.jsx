import React, { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    // DESCRIPTION: 
    // This context initializes the Socket.io connection to the backend.
    // It listens for 'stockPriceUpdate' and 'alertTriggered' events 
    // to provide real-time updates to any component in the app.

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
