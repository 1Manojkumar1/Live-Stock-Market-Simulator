import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const Login = () => {
    return (
        <div className="auth-page">
            {/* 
                DESCRIPTION: 
                Simple form with:
                - Email Input.
                - Password Input.
                - 'Login' button triggers /auth/login.
                - Link to 'Register' page.
            */}
            <h1>LOGIN</h1>
            <p>Page: Sign-in form for existing users.</p>
        </div>
    );
};

export default Login;
