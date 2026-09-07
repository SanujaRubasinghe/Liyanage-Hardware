import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import API from '../api';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const FeedbackAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [adminResponse, setAdminResponse] = useState('');

  const itemsPerPage = 10;

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange, statusFilter, typeFilter]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (startDate) params.append('startDate', startDate.toISOString());
      if (endDate) params.append('endDate', endDate.toISOString());
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (typeFilter !== 'all') params.append('type', typeFilter);

      const response = await API.get(`/feedback/analytics?${params.toString()}`);
      
      if (response.status !== 200) throw new Error(response.data.message || 'Failed to fetch analytics');
      setAnalytics(response.data.data);
    } catch (error) {
      toast.error(error.message || 'Error loading feedback analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (feedbackId, newStatus) => {
    try {
      const response = await API.put(`/feedback/${feedbackId}/status`, {
        status: newStatus
      });
      
      if (response !== 200) throw new Error(response.data.message || 'Failed to update status');
      
      toast.success(`Feedback status updated to ${newStatus}`);
      fetchAnalytics();
    } catch (error) {
      toast.error(error.message || 'Error updating feedback status');
    }
  };

  const submitAdminResponse = async () => {
    if (!selectedFeedback || !adminResponse.trim()) {
      toast.warning('Please enter a response');
      return;
    }

    try {
      const response = await API.put(`/feedback/${selectedFeedback.id}/response`, {
        response: adminResponse
      });

      const data = await response.json();
      
      if (response !== 200) throw new Error(response.data.message || 'Failed to submit response');
      
      toast.success('Response submitted successfully');
      setAdminResponse('');
      setSelectedFeedback(null);
      fetchAnalytics();
    } catch (error) {
      toast.error(error.message || 'Error submitting response');
    }
  };

  const renderStatusBadge = (status) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      resolved: 'bg-blue-100 text-blue-800',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const renderTypeBadge = (type) => {
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        type === 'review' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'
      }`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  if (loading && !analytics) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!analytics) {
    return <div className="text-center py-10 text-gray-500">No analytics data available</div>;
  }

  // Pagination calculations
  const totalPages = Math.ceil(analytics.feedbacks.length / itemsPerPage);
  const paginatedFeedbacks = analytics.feedbacks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Chart data preparations
  const statusDistributionData = {
    labels: Object.keys(analytics.statusDistribution),
    datasets: [
      {
        label: 'Feedback by Status',
        data: Object.values(analytics.statusDistribution),
        backgroundColor: [
          'rgba(255, 206, 86, 0.7)', // pending - yellow
          'rgba(75, 192, 192, 0.7)',  // approved - green
          'rgba(255, 99, 132, 0.7)',  // rejected - red
          'rgba(54, 162, 235, 0.7)',  // resolved - blue
        ],
        borderColor: [
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const typeDistributionData = {
    labels: ['Reviews', 'Complaints'],
    datasets: [
      {
        data: [analytics.typeDistribution.review, analytics.typeDistribution.complaint],
        backgroundColor: [
          'rgba(153, 102, 255, 0.7)', // review - purple
          'rgba(255, 159, 64, 0.7)',   // complaint - orange
        ],
        borderColor: [
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const ratingTrendData = {
    labels: analytics.ratingTrend.labels,
    datasets: [
      {
        label: 'Average Rating',
        data: analytics.ratingTrend.data,
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Feedback Analytics</h1>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => setDateRange(update)}
              isClearable={true}
              placeholderText="Select date range"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="review">Reviews</option>
              <option value="complaint">Complaints</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchAnalytics}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-500">Total Feedback</h3>
          <p className="text-3xl font-bold text-gray-800">{analytics.totalFeedback}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-500">Average Rating</h3>
          <p className="text-3xl font-bold text-gray-800">
            {analytics.averageRating ? Number(analytics.averageRating).toFixed(1) : 'N/A'}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-500">Pending Responses</h3>
          <p className="text-3xl font-bold text-gray-800">{analytics.pendingCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-500">Resolved Rate</h3>
          <p className="text-3xl font-bold text-gray-800">
            {analytics.resolutionRate ? `${analytics.resolutionRate}%` : 'N/A'}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Status Distribution</h3>
          <div className="h-64">
            <Pie data={statusDistributionData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Type Distribution</h3>
          <div className="h-64">
            <Bar data={typeDistributionData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Rating Trend (Last 30 Days)</h3>
          <div className="h-64">
            <Line data={ratingTrendData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackAnalytics;