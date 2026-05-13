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
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const StockChart = ({ stockId, initialHistory = [], compact = false }) => {
    const socket = useContext(SocketContext);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [{
            label: 'Price',
            data: [],
            borderColor: '#18181b',
            backgroundColor: 'rgba(24, 24, 27, 0.05)',
            tension: 0.45,
            cubicInterpolationMode: 'monotone',
            pointRadius: 0,
            fill: true,
            borderCapStyle: 'round',
            borderJoinStyle: 'round'
        }]
    });

    // Update chart data when initialHistory changes (after async fetch)
    useEffect(() => {
        if (initialHistory && initialHistory.length > 0) {
            setChartData({
                labels: initialHistory.map(h => {
                    const date = new Date(h.timestamp);
                    // Use date for longer histories, time for short ones
                    return initialHistory.length > 50 
                        ? date.toLocaleDateString([], { month: 'short', day: 'numeric' })
                        : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                }),
                datasets: [{
                    label: 'Price',
                    data: initialHistory.map(h => h.price),
                    borderColor: '#18181b',
                    backgroundColor: 'rgba(24, 24, 27, 0.05)',
                    tension: 0.45,
                    cubicInterpolationMode: 'monotone',
                    pointRadius: 0,
                    fill: true,
                }]
            });
        }
    }, [initialHistory]);

    useEffect(() => {
        if (!socket) return;

        const handleUpdate = (update) => {
            if (update.stockId === stockId) {
                setChartData(prev => {
                    const newLabels = [...prev.labels, new Date(update.timestamp).toLocaleTimeString()];
                    const newData = [...prev.datasets[0].data, update.newPrice];

                    if (newLabels.length > 30) {
                        newLabels.shift();
                        newData.shift();
                    }

                    const priceChange = update.priceChange ?? (update.newPrice - prev.datasets[0].data[prev.datasets[0].data.length - 1]);

                    return {
                        labels: newLabels,
                        datasets: [{
                            ...prev.datasets[0],
                            data: newData,
                            borderColor: priceChange < 0 ? '#f43f5e' : '#10b981',
                            backgroundColor: priceChange < 0 ? 'rgba(244, 63, 94, 0.05)' : 'rgba(16, 185, 129, 0.05)',
                        }]
                    };
                });
            }
        };

        socket.on('stockPriceUpdate', handleUpdate);
        return () => socket.off('stockPriceUpdate', handleUpdate);
    }, [socket, stockId]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { 
                enabled: !compact && chartData.labels.length > 0,
                mode: 'index', 
                intersect: false,
                backgroundColor: '#18181b',
                padding: 10,
                displayColors: false
            },
        },
        scales: {
            x: { 
                display: !compact, 
                grid: { display: false },
                ticks: { maxRotation: 0, font: { size: 10 } }
            },
            y: { 
                display: !compact, 
                grid: { color: '#f4f4f5' }, 
                beginAtZero: false,
                ticks: {
                    font: { size: 10 },
                    callback: (val) => '₹' + val.toLocaleString()
                },
                // Strictly zoom in on the data range to force curved visualization
                min: (context) => {
                    const data = context.chart.data.datasets[0].data;
                    if (data.length < 2) return undefined;
                    const min = Math.min(...data);
                    const max = Math.max(...data);
                    const range = max - min;
                    // If flat, give it a tiny range to avoid division by zero or default scaling
                    if (range === 0) return min - 1;
                    return min - (range * 0.1); 
                },
                max: (context) => {
                    const data = context.chart.data.datasets[0].data;
                    if (data.length < 2) return undefined;
                    const min = Math.min(...data);
                    const max = Math.max(...data);
                    const range = max - min;
                    if (range === 0) return max + 1;
                    return max + (range * 0.1);
                }
            }
        },
        elements: {
            line: {
                borderWidth: compact ? 2 : 3
            }
        },
        animation: { duration: 500 }
    };

    if (chartData.labels.length === 0) {
        return <div className={`w-full ${compact ? 'h-16' : 'h-64'} bg-gray-50/50 animate-pulse rounded-xl`} />;
    }

    return (
        <div className={`w-full ${compact ? 'h-16' : 'h-64'}`}>
            <Line data={chartData} options={options} />
        </div>
    );
};

export default StockChart;


