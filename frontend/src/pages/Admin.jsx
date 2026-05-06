import React from 'react';
import UsersList from '../components/admin/UsersList';
import StockManager from '../components/admin/StockManager';
import SystemConfig from '../components/admin/SystemConfig';

const Admin = () => {
    return (
        <div className="page-container">
            <h1>ADMIN CONTROL PANEL</h1>
            {/* 
                DESCRIPTION: 
                Exclusive page for admins.
                Imports and renders UsersList, StockManager, and SystemConfig.
            */}
            <UsersList />
            <StockManager />
            <SystemConfig />
        </div>
    );
};

export default Admin;
