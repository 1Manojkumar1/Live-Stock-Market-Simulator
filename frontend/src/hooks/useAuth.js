import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
    // DESCRIPTION: 
    // A custom hook that provides easy access to the AuthContext.
    // Use this in any component to get user info or trigger login/logout.
    return useContext(AuthContext);
};
