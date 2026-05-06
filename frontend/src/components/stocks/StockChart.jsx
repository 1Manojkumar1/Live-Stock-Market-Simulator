import React, { useState, useEffect, useContext } from 'react';
import { Line } from 'react-chartjs-2';
import { SocketContext } from '../../contexts/SocketContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StockChart = ({ stockId, initialHistory }) => {
    const socket = useContext(SocketContext);
    const [chartData, setChartData] = useState({
        labels: initialHistory.map(h => new Date(h.timestamp).toLocaleTimeString()),
        datasets: [{
            label: 'Price (₹)',
            data: initialHistory.map(h => h.price),
            borderColor: '#10b981', // Success Green
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.3,
            fill: true,
        }]
    });

    useEffect(() => {
        if (!socket) return;

        // Listen for live price updates for this specific stock
        socket.on('stockPriceUpdate', (update) => {
            if (update.stockId === stockId) {
                setChartData(prev => {
                    const newLabels = [...prev.labels, new Date(update.timestamp).toLocaleTimeString()];
                    const newData = [...prev.datasets[0].data, update.newPrice];

                    // Keep only the last 20 points to prevent chart from getting too crowded
                    if (newLabels.length > 20) {
                        newLabels.shift();
                        newData.shift();
                    }

                    return {
                        labels: newLabels,
                        datasets: [{
                            ...prev.datasets[0],
                            data: newData,
                            // Change color to red if price went down
                            borderColor: update.priceChange < 0 ? '#ef4444' : '#10b981'
                        }]
                    };
                });
            }
        });

        return () => socket.off('stockPriceUpdate');
    }, [socket, stockId]);

    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: { mode: 'index', intersect: false },
        },
        scales: {
            x: { grid: { display: false } },
            y: { beginAtZero: false }
        },
        animation: { duration: 500 }
    };

    return (
        <div className="bg-slate-900 p-4 rounded-xl shadow-lg border border-slate-700">
            <Line data={chartData} options={options} />
        </div>
    );
};

export default StockChart;
