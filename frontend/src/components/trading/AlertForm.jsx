import React, { useState } from 'react';
import api from '../../services/api';

const AlertForm = ({ stockId }) => {
    return (
        <div className="alert-form-card">
            {/* 
                DESCRIPTION: 
                Inputs for:
                - Target Price.
                - Direction (Dropdown: Goes Above / Goes Below).
                - 'Set Alert' button triggers /user-api/alerts.
            */}
            <p>Component: Small form to create a price notification for a stock.</p>
        </div>
    );
};

export default AlertForm;
