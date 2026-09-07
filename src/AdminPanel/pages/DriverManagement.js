import React, { useState, useEffect } from 'react';
import API from "../api"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DriverManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [isLoadingDrivers, setIsLoadingDrivers] = useState(false);
  const [newDriver, setNewDriver] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  // Fetch drivers on component mount
  useEffect(() => {
    const fetchDrivers = async () => {
      setIsLoadingDrivers(true);
      try {
        const response = await API.get('/drivers');
        setDrivers(response.data);
      } catch (error) {
        toast.error('Failed to load drivers');
        console.error('Error fetching drivers:', error);
      } finally {
        setIsLoadingDrivers(false);
      }
    };
    
    fetchDrivers();
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.warning('Please enter an order number');
      return;
    }

    setIsSearching(true);
    try {
      const response = await API.get(`/orders/delivery-search?q=${searchTerm}`);
      setSearchResults(response.data);
      if (response.data.length === 0) {
        toast.info('No orders found matching your search');
      }
    } catch (error) {
      toast.error('Failed to search orders');
      console.error('Error searching orders:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAssignDriver = async (orderId, driverId) => {
    if (!driverId) {
      toast.warning('Please select a driver');
      return;
    }

    try {
      await API.patch(`/orders/${orderId}/assign-driver`, { driverId });
      toast.success('Driver assigned successfully');
      
      // Update the local state to reflect the assignment
      setSearchResults(prev => 
        prev.map(order => 
          order.order_id === orderId 
            ? { ...order, assigned_driver_id: driverId } 
            : order
        )
      );
      
      if (selectedOrder?.order_id === orderId) {
        setSelectedOrder(prev => ({ ...prev, assigned_driver_id: driverId }));
      }
    } catch (error) {
      toast.error('Failed to assign driver');
      console.error('Error assigning driver:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Assign Deliveries</h1>
        
        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Search Orders</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Enter partial order number"
              className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {/* Results and Assignment Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search Results */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Search Results</h2>
              
              {searchResults.length > 0 ? (
                <div className="space-y-4">
                  {searchResults.map(order => (
                    <div 
                      key={order.order_id} 
                      className={`border rounded-lg p-4 cursor-pointer transition ${selectedOrder?.order_id === order.order_id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                      onClick={() => setSelectedOrder(order)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-800">Order #{order.order_id}</h3>
                          <p className="text-sm text-gray-600">{order.first_name} {order.last_name}</p>
                          <p className="text-sm text-gray-600">{order.shipping_address}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {isSearching ? 'Searching...' : 'No orders found. Try searching with a partial order number.'}
                </div>
              )}
            </div>
          </div>

          {/* Assignment Panel */}
          <div className="lg:col-span-1">
            {selectedOrder ? (
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Assign Driver</h2>
                
                <div className="mb-6">
                  <h3 className="font-medium text-gray-800 mb-2">Order Details</h3>
                  <p className="text-sm text-gray-600">#{selectedOrder.order_id}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.first_name} {selectedOrder.last_name}</p>
                  <p className="text-sm text-gray-600 mt-2">{selectedOrder.shipping_address}</p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Driver</label>
                  {isLoadingDrivers ? (
                    <div className="animate-pulse h-10 bg-gray-200 rounded"></div>
                  ) : (
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      value={selectedOrder.assigned_driver_id || ''}
                      onChange={(e) => handleAssignDriver(selectedOrder.order_id, e.target.value)}
                    >
                      <option value="">-- Select Driver --</option>
                      {drivers.map(driver => (
                        <option key={driver.id} value={driver.id}>
                          {driver.name} ({driver.phone})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {selectedOrder.assigned_driver_id && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-800">
                      Driver assigned: {drivers.find(d => d.id === selectedOrder.assigned_driver_id)?.name}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Driver Assignment</h2>
                <p className="text-gray-500">Select an order from the search results to assign a driver.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverManagement;