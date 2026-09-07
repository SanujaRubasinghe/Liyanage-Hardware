import React, { useState, useEffect } from 'react';
import API from '../api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const LoyaltyAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      const response = await API.get('/loyalty/analytics');
      setAnalyticsData(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch analytics data');
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!analyticsData) {
    return <div className="text-center text-gray-500">No analytics data available</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Loyalty Program Analytics</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeRange('week')}
            className={`px-3 py-1 rounded ${timeRange === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1 rounded ${timeRange === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Month
          </button>
          <button
            onClick={() => setTimeRange('year')}
            className={`px-3 py-1 rounded ${timeRange === 'year' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Year
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">User Growth</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.growthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="new_users" name="New Users" fill="#8884d8" />
                <Bar dataKey="total_users" name="Total Users" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Visit Frequency Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData.visitDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="user_count"
                  nameKey="visit_range"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {analyticsData.visitDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Points Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.pointsDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="points_range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="user_count" name="Users" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Top Rewards</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={analyticsData.topRewards}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Bar dataKey="claims" name="Claims" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Message Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analyticsData.messageStats.map((stat, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded">
              <h3 className="font-medium text-gray-700">{stat.status.toUpperCase()}</h3>
              <p className="text-2xl font-bold">{stat.count}</p>
              <p className="text-sm text-gray-500">
                {stat.deal_messages} deal messages, {stat.custom_messages} custom messages
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoyaltyAnalytics;