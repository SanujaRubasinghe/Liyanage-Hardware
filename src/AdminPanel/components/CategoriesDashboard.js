import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { FiBarChart2, FiLayers, FiPieChart, FiTrendingUp } from 'react-icons/fi';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import API from '../api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const CategoriesDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState([]);
  const [timePeriod, setTimePeriod] = useState('30d');
  
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const { data } = await API.get('/categories/analytics/summary');
        setSummary(data.summary);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to fetch categories summary');
        setLoading(false);
      }
    };
    
    fetchSummary();
  }, [timePeriod]);

  const topCategories = [...summary]
    .sort((a, b) => b.total_views - a.total_views)
    .slice(0, 5);
  
  const byLevel = summary.reduce((acc, cat) => {
    acc[cat.level] = (acc[cat.level] || 0) + 1;
    return acc;
  }, {});

  const levelData = Object.entries(byLevel).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 w-full">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Categories Analytics</h1>
        <select
          value={timePeriod}
          onChange={(e) => setTimePeriod(e.target.value)}
          className="border rounded-lg p-2 min-w-[150px]"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>
      
      {/* Stats Cards - Auto-adjusting grid */}
      <div 
        className="grid gap-4 mb-8"
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))'
        }}
      >
        <div className="bg-white p-4 rounded-xl shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
              <FiLayers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Categories</p>
              <p className="text-xl font-semibold text-gray-800">{summary.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <FiBarChart2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Views</p>
              <p className="text-xl font-semibold text-gray-800">
                {summary.reduce((sum, cat) => sum + (Number(cat.total_views) || 0), 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <FiTrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Avg. CTR</p>
              <p className="text-xl font-semibold text-gray-800">
                {(
                  summary.reduce((sum, cat) => sum + (Number(cat.ctr) || 0), 0) / 
                  (summary.filter(cat => cat.ctr).length || 1)
                ).toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <FiPieChart className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Primary Categories</p>
              <p className="text-xl font-semibold text-gray-800">
                {summary.filter(cat => cat.level === 'primary').length}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts Section - Auto-adjusting columns */}
      <div 
        className="grid gap-6 mb-8"
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))'
        }}
      >
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Top Categories by Views</h3>
          <div style={{ height: 'clamp(250px, 30vw, 350px)' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topCategories}
                layout="vertical"
                margin={{ top: 5, right: 10, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Legend />
                <Bar dataKey="total_views" name="Views" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Categories by Level</h3>
          <div style={{ height: 'clamp(250px, 30vw, 350px)' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={levelData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius="70%"
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {levelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Table Section */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-800">All Categories Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Level</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Views</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">CTR</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {summary.map((category) => (
                <tr key={category.category_id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {category.thumbnail ? (
                          <img 
                            className="h-10 w-10 rounded-md object-cover" 
                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}${category.thumbnail}`} 
                            alt={category.name} 
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                            <FiLayers className="text-gray-400 w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                        <div className="text-sm text-gray-500">{category.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${category.level === 'primary' ? 'bg-indigo-100 text-indigo-800' : 
                        category.level === 'secondary' ? 'bg-purple-100 text-purple-800' : 
                        'bg-pink-100 text-pink-800'}`}>
                      {category.level}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {category.total_views?.toLocaleString() || '0'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {category.ctr ? `${category.ctr}%` : '0%'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`/categories/analytics/${category.category_id}`}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Analytics
                    </Link>
                    <Link
                      to={`/categories/edit/${category.category_id}`}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CategoriesDashboard;
