import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const UsersList = () => {
    return (
        <div className="admin-users-table">
            {/* 
                DESCRIPTION: 
                Table showing:
                - Name, Email, Role.
                - Current Balance.
                - Account Status (Active/Blocked).
                - Action Buttons: 'Block' or 'Unblock' (calls /admin-api/users/:id/block).
            */}
            <p>Component: Admin table for user management and status toggling.</p>
        </div>
    );
};

export default UsersList;
