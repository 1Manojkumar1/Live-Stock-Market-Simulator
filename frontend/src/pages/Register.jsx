import React, { useState } from 'react';
import api from '../services/api';

const Register = () => {
    return (
        <div className="auth-page">
            {/* 
                DESCRIPTION: 
                Sign-up form with:
                - Name Input.
                - Email Input.
                - Password Input.
                - Role selection (default TRADER).
                - 'Register' button triggers /auth/register.
            */}
            <h1>REGISTER</h1>
            <p>Page: Sign-up form for new traders.</p>
        </div>
    );
};

export default Register;
