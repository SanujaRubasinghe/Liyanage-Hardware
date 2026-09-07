import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import API from '../api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const VisitorGraph = ({visitors}) => {

  const chartData = {
    labels: visitors.map(item => new Date(item.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Total Visits',
        data: visitors.map(item => item.visitor_count),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.3,
        yAxisID: 'y',
      },
      {
        label: 'Unique Visitors',
        data: visitors.map(item => item.unique_visitors),
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        tension: 0.3,
        yAxisID: 'y',
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      }
    }
  };

  return (
    <div className="w-full h-[400px] bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Daily Visitors (Last 30 Days)</h3>
      <div className="w-full h-full">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default VisitorGraph;