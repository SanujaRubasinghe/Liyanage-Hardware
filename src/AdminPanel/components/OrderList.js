import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { formatCurrency } from '../utils/formatCurrency';
import API from '../api';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-yellow-100 text-orange-800'
};

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce function
  const debounce = (func, delay) => {
    let timer;
    return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  };

  // Memoized debounced version of setSearchTerm
  const debouncedSearch = useCallback(
    debounce((term) => {
      setDebouncedSearchTerm(term);
    }, 500),
    [] // Empty dependency array means this is created once
  );

  // Update debounced search term when searchTerm changes
  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => {
      // Cleanup function to cancel the debounce on unmount
      debouncedSearch.cancel?.();
    };
  }, [searchTerm, debouncedSearch]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        let url = `/orders?page=${page}&limit=${limit}`;
        
        if (statusFilter) {
          url += `&status=${statusFilter}`;
        }
        
        if (debouncedSearchTerm) {
          url += `&search=${debouncedSearchTerm}`;
        }
        
        const response = await API.get(url);
        const data = response.data;
        
        setOrders(data.orders);
        setTotal(data.total);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setLoading(false);
      }
    };
    fetchOrders()
    // if (page === 1) {
    //   fetchOrders();
    // } else {
    //   setPage(1);
    // }
  }, [page, limit, statusFilter, debouncedSearchTerm]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm, statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/${orderId}/status`, {status: newStatus});
      setOrders(orders.map(order => 
        order.order_id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // Don't submit the form - let the debounced effect handle it
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Orders</h1>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          {/* Search Form */}
          <div className="flex-1 sm:w-64">
            <div className="relative">
              <input
                type="text"
                placeholder="Search order ID..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Status Filter */}
          <div className="w-full sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>
      
       <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] md:min-w-0 divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Date</th>
              {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Customer</th> */}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">Payment</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.order_id}>
                <td className="px-4 py-4 whitespace-nowrap">
                  <Link to={`/orders/${order.order_id}`} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                    #{order.order_id}
                  </Link>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                  {format(new Date(order.order_date), 'MMM dd, yyyy HH:mm')}
                </td>
                {/* <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                  User #{order.user_id}
                </td> */}
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatCurrency(order.total_amount)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden xl:table-cell">
                  {order.payment_method} ({order.payment_status})
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
                    className="w-full sm:w-auto border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
        <div className="text-sm text-gray-500">
          Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} orders
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page * limit >= total}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderList;