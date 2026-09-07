import React, { useState, useEffect } from 'react';
import { socket } from "../socket";  // Using the imported socket instance
import StatCard from '../components/StatCard';
import DeviceDistributionChart from '../components/DeviceDistributionChart';
import MostViewedProducts from '../components/MostViewedProducts';
import PopularSearches from '../components/PopularSearches';
import LiveActivities from '../components/LiveActivities';
import VisitorGraph from '../components/VisitorGraph';
import API from '../api';

const AnalyticsDashboard = () => {
  const [stats, setStats] = useState({
    pageVisitsToday: 0,
    productViewsToday: 0,
    cartAddsToday: 0,
    checkoutsToday: 0,
    activeUsers: 0,
    deviceDistribution: [],
    mostViewedProducts: [],
    popularSearches: [],
    dailyVisitors: []
  });
  const [liveActivities, setLiveActivities] = useState([]);

  useEffect(() => {
    // Fetch initial data
    const fetchData = async () => {
      try {
        const response = await API.get('/analytics/dashboard-data');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      }
    };
    
    fetchData();

    // Socket event listeners
    // const onActiveUsers = (data) => {
    //   setStats(prev => ({
    //     ...prev, 
    //     activeUsers: data.count || data  // Handle both formats
    //   }));
    // };

    const onPageVisit = (data) => {
      setLiveActivities(prev => [
        {
          type: 'pageVisit',
          message: `Page visited: ${data.page_url}`,
          device: data.device_type,
          timestamp: new Date(data.timestamp)
        },
        ...prev.slice(0, 9)
      ]);
    };

    const onProductView = (data) => {
      setLiveActivities(prev => [
        {
          type: 'productView',
          message: `Product viewed: #${data.product_id}`,
          device: data.device_type,
          timestamp: new Date(data.timestamp)
        },
        ...prev.slice(0, 9)
      ]);
    };

    const onCartAction = (data) => {
      setLiveActivities(prev => [
        {
          type: 'cartAction',
          message: `Cart ${data.action}: Product #${data.product_id} (Qty: ${data.quantity})`,
          timestamp: new Date(data.timestamp)
        },
        ...prev.slice(0, 9)
      ]);
    };

    const onSearchQuery = (data) => {
      setLiveActivities(prev => [
        {
          type: 'searchQuery',
          message: `Search: "${data.query}" (${data.results_count} results)`,
          timestamp: new Date(data.timestamp)
        },
        ...prev.slice(0, 9)
      ]);
    };

    const onCheckout = (data) => {
      setLiveActivities(prev => [
        {
          type: 'checkout',
          message: `Checkout: $${data.amount} (${data.items_count} items) - ${data.status}`,
          timestamp: new Date(data.timestamp)
        },
        ...prev.slice(0, 9)
      ]);
    };

    const interval = setInterval(fetchData, 300000);

    // Subscribe to socket events
    // socket.on('analytics:activeUsers', onActiveUsers);
    socket.on('analytics:pageVisit', onPageVisit);
    socket.on('analytics:productView', onProductView);
    socket.on('analytics:cartAction', onCartAction);
    socket.on('analytics:searchQuery', onSearchQuery);
    socket.on('analytics:checkout', onCheckout);

    // Cleanup function
    return () => {
      // socket.off('analytics:activeUsers', onActiveUsers);
      socket.off('analytics:pageVisit', onPageVisit);
      socket.off('analytics:productView', onProductView);
      socket.off('analytics:cartAction', onCartAction);
      socket.off('analytics:searchQuery', onSearchQuery);
      socket.off('analytics:checkout', onCheckout);
      clearInterval(interval)
    };
  }, []);  // Empty dependency array means this runs once on mount

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Analytics Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Page Visits Today" 
          value={stats.pageVisitsToday} 
          icon="👁️"
          trend="up"
        />
        <StatCard 
          title="Product Views" 
          value={stats.productViewsToday} 
          icon="🛍️"
          trend="up"
        />
        <StatCard 
          title="Add to Cart" 
          value={stats.cartAddsToday} 
          icon="🛒"
          trend="up"
        />
        <StatCard 
          title="Checkouts" 
          value={stats.checkoutsToday} 
          icon="💰"
          trend="up"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Device Distribution</h2>
          <DeviceDistributionChart data={stats.deviceDistribution} />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Most Viewed Products</h2>
          <MostViewedProducts products={stats.mostViewedProducts} />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Popular Searches</h2>
          <PopularSearches searches={stats.popularSearches} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
          <VisitorGraph visitors={stats.dailyVisitors} />
      </div>

      
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Live Activities</h2>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
            <span className="text-sm text-gray-600">{stats.activeUsers} active users</span>
          </div>
        </div>
        <LiveActivities activities={liveActivities} />
      </div>
    </div>
  );
};

export default AnalyticsDashboard;