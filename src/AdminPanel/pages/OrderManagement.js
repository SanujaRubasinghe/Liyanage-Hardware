// src/components/Dashboard.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import OrderSummaryCards from '../components/OrderSummaryCards';
import API from '../api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const OrderManagement = () => {
  const [summary, setSummary] = useState(null);
  const [statusData, setStatusData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, statusRes, revenueRes, paymentRes] = await Promise.all([
          API.get('/orders/summary'),
          API.get('/orders/status-distribution'),
          API.get('/orders/revenue-trend'),
          API.get('/orders/payment-methods')
        ]);
        
        setSummary(summaryRes.data);
        setStatusData(statusRes.data);
        setRevenueData(revenueRes.data);
        setPaymentData(paymentRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      
      <OrderSummaryCards data={summary} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Revenue Trend (Last 30 Days)</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="daily_revenue" name="Revenue" fill="#8884d8" />
                <Bar yAxisId="right" dataKey="order_count" name="Orders" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Order Status Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="status"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Payment Methods</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={paymentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="payment_method" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="Order Count" fill="#0088FE" />
              <Bar dataKey="total_amount" name="Total Amount" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;