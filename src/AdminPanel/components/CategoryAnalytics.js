import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiBarChart2, FiTrendingUp, FiEye, FiMousePointer, FiDollarSign } from 'react-icons/fi';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

import API from '../api';

const CategoryAnalytics = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(null);
  const [analytics, setAnalytics] = useState([]);
  const [summary, setSummary] = useState(null);
  const [period, setPeriod] = useState('30d');
  
  const periods = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' }
  ];

  useEffect(() => {
    function convertUTCToLocalDate(utcDateString) {
      const date = new Date(utcDateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [{ data: categoryData }, { data: analyticsData }] = await Promise.all([
          API.get(`/categories/${id}`),
          API.get(`/categories/${id}/analytics`, { params: { period } })
        ]);
        
        setCategory(categoryData.category);

        const localAnalytics = analyticsData.analytics.map(entry => ({
          ...entry,
          date: convertUTCToLocalDate(entry.date)
        }));

        setAnalytics(localAnalytics);
        
        // Calculate summary
        if (analyticsData.analytics.length > 0) {
          const summaryData = {
            totalViews: analyticsData.analytics.reduce((sum, item) => sum + Number(item.views), 0),
            totalClicks: analyticsData.analytics.reduce((sum, item) => sum + Number(item.clicks), 0),
            totalConversions: analyticsData.analytics.reduce((sum, item) => sum + Number(item.conversions), 0),
          };
          summaryData.ctr = (summaryData.totalClicks / summaryData.totalViews * 100).toFixed(2);
          summaryData.conversionRate = (summaryData.totalConversions / summaryData.totalClicks * 100).toFixed(2);
          setSummary(summaryData);
        }
        
        setLoading(false);
      } catch (error) {
        toast.error('Failed to fetch analytics data');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, period]);

  const numericData = analytics.map(item => ({
    ...item,
    views: Number(item.views),
    clicks: Number(item.clicks)
  }))

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Analytics for {category?.name || 'Category'}
        </h1>
        <div className="flex items-center space-x-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          >
            {periods.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
      </div>
      
      {analytics.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <FiBarChart2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No analytics data available</h3>
          <p className="mt-2 text-sm text-gray-500">There's no analytics data for this category yet.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
                  <FiEye size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Views</p>
                  <p className="text-2xl font-semibold text-gray-800">{summary?.totalViews.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                  <FiMousePointer size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Clicks</p>
                  <p className="text-2xl font-semibold text-gray-800">{summary?.totalClicks.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                  <FiDollarSign size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Conversions</p>
                  <p className="text-2xl font-semibold text-gray-800">{summary?.totalConversions.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                  <FiTrendingUp size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
                  <p className="text-2xl font-semibold text-gray-800">{summary?.conversionRate}%</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Views Over Time</h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={numericData}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date"
                     />
                    <YAxis
                      domain={[0, (dataMax) => Math.max(dataMax * 1.1, 10)]} // 10% padding, min 10 units
                      allowDataOverflow={false} // Ensures all data stays visible
                      width={40}
                    />
                    <Tooltip />
                    <Legend
                      wrapperStyle={{paddingTop: '10px'}}
                    />
                    <Line
                      type="monotone"
                      dataKey="views"
                      stroke="#4f46e5"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                      name="Views"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Clicks & Conversions</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={numericData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" />
                    <YAxis
                      domain={[0, (dataMax) => Math.max(dataMax * 1.1, 10)]} // 10% padding, min 10 units
                      allowDataOverflow={false} // Ensures all data stays visible
                      width={40}
                    />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="clicks"
                      fill="#8b5cf6"
                      name="Clicks"
                    />
                    <Bar
                      dataKey="conversions"
                      fill="#10b981"
                      name="Conversions"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Detailed Data</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CTR</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversion Rate</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analytics.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.views.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.clicks.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.conversions.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {((item.clicks / item.views) * 100 || 0).toFixed(2)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {((item.conversions / item.clicks) * 100 || 0).toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryAnalytics;