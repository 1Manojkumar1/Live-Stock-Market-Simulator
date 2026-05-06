import React from 'react';
import { Line } from 'react-chartjs-2';

const StockChart = ({ history }) => {
    return (
        <div className="chart-container">
            {/* 
                DESCRIPTION: 
                A visual line chart (using Chart.js) that renders the priceHistory 
                array from the backend. Shows stock price trends over time.
            */}
            <p>Component: Line Chart visualization of historical stock prices.</p>
        </div>
    );
};

export default StockChart;
