import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const Navbar = () => {
    return (
        <nav className="navbar">
            {/* 
                DESCRIPTION: 
                Top navigation bar containing:
                - App Logo and Title.
                - Current User's Name and Balance (live).
                - Logout Button (triggers AuthContext logout).
            */}
            <p>Component: Top Bar with Branding, User Stats (₹), and Logout button.</p>
        </nav>
    );
};

export default Navbar;
