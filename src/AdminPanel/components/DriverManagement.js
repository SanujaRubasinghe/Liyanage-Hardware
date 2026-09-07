import React, { useState, useEffect } from 'react';
import API from '../api';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Edit, Trash2, RefreshCw, Plus, Key, Lock } from 'lucide-react';

const DriverManagementComp = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingDriver, setEditingDriver] = useState(null);
  const [showPassword, setShowPassword] = useState({});
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [newDriver, setNewDriver] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const [resetPasswordData, setResetPasswordData] = useState({
    driverId: null,
    newPassword: '',
    confirmPassword: ''
  });
  const [showResetModal, setShowResetModal] = useState(false);

  // Fetch all drivers
  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const response = await API.get('/drivers');
      setDrivers(response.data);
      // Initialize showPassword state
      const initialShowPassword = {};
      response.data.forEach(driver => {
        initialShowPassword[driver.id] = false;
      });
      setShowPassword(initialShowPassword);
    } catch (error) {
      toast.error('Failed to fetch drivers');
      console.error('Error fetching drivers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDriver = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/drivers/${editingDriver.id}`, editingDriver);
      toast.success('Driver updated successfully');
      setEditingDriver(null);
      fetchDrivers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update driver');
      console.error('Error updating driver:', error);
    }
  };

  const handleDeleteDriver = async (id) => {
    if (!window.confirm('Are you sure you want to delete this driver?')) return;
    
    try {
      await API.delete(`/drivers/${id}`);
      toast.success('Driver deleted successfully');
      fetchDrivers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete driver');
      console.error('Error deleting driver:', error);
    }
  };

  const handleRegisterDriver = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!newDriver.name || !newDriver.email || !newDriver.password || !newDriver.phone) {
      toast.warning('Please fill all fields');
      return;
    }

    try {
      const response = await API.post('/drivers', newDriver);
      setDrivers(prev => [...prev, response.data]);
      toast.success('Driver registered successfully');
      
      // Reset form
      setNewDriver({
        name: '',
        email: '',
        password: '',
        phone: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register driver');
      console.error('Error registering driver:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDriver(prev => ({ ...prev, [name]: value }));
  };

  const handleResetPassword = async () => {
    const { driverId, newPassword, confirmPassword } = resetPasswordData;
    
    if (!newPassword || !confirmPassword) {
      toast.warning('Please fill all password fields');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.warning('Passwords do not match');
      return;
    }
    
    if (newPassword.length < 8) {
      toast.warning('Password must be at least 8 characters');
      return;
    }

    try {
      setIsResettingPassword(true);
      await API.patch(`/drivers/${driverId}/reset-password`, { 
        newPassword 
      });
      toast.success('Password reset successfully');
      closeResetModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
      console.error('Error resetting password:', error);
    } finally {
      setIsResettingPassword(false);
    }
  };

  const toggleShowPassword = (id) => {
    setShowPassword(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const openResetModal = (driverId) => {
    setResetPasswordData({
      driverId,
      newPassword: '',
      confirmPassword: ''
    });
    setShowResetModal(true);
  };

  const closeResetModal = () => {
    setShowResetModal(false);
    setResetPasswordData({
      driverId: null,
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Driver Management</h1>

      {/* Register New Driver Form */}
      <div className="mt-8 mb-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Register New Driver</h2>
        
        <form onSubmit={handleRegisterDriver} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={newDriver.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={newDriver.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={newDriver.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={newDriver.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              required
            />
          </div>
          
          <div className="md:col-span-2">
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition"
            >
              Register Driver
            </button>
          </div>
        </form>
      </div>
      
      {/* Drivers List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {drivers.map((driver) => (
                  <tr key={driver.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingDriver?.id === driver.id ? (
                        <input
                          type="text"
                          value={editingDriver.name}
                          onChange={(e) => setEditingDriver({...editingDriver, name: e.target.value})}
                          className="border rounded px-2 py-1 w-full"
                        />
                      ) : (
                        <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingDriver?.id === driver.id ? (
                        <input
                          type="email"
                          value={editingDriver.email}
                          onChange={(e) => setEditingDriver({...editingDriver, email: e.target.value})}
                          className="border rounded px-2 py-1 w-full"
                        />
                      ) : (
                        <div className="text-sm text-gray-500">{driver.email}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingDriver?.id === driver.id ? (
                        <input
                          type="tel"
                          value={editingDriver.phone}
                          onChange={(e) => setEditingDriver({...editingDriver, phone: e.target.value})}
                          className="border rounded px-2 py-1 w-full"
                        />
                      ) : (
                        <div className="text-sm text-gray-500">{driver.phone}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {editingDriver?.id === driver.id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={handleUpdateDriver}
                            className="text-green-600 hover:text-green-900"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingDriver(null)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex space-x-4">
                          <button
                            onClick={() => setEditingDriver(driver)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteDriver(driver.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                          <button
                            onClick={() => openResetModal(driver.id)}
                            className="text-purple-600 hover:text-purple-900"
                            title="Reset Password"
                          >
                            <Key size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Lock className="mr-2" /> Reset Password
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={resetPasswordData.newPassword}
                  onChange={(e) => setResetPasswordData({
                    ...resetPasswordData,
                    newPassword: e.target.value
                  })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={resetPasswordData.confirmPassword}
                  onChange={(e) => setResetPasswordData({
                    ...resetPasswordData,
                    confirmPassword: e.target.value
                  })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Confirm new password"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  onClick={closeResetModal}
                  className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetPassword}
                  disabled={isResettingPassword}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
                >
                  {isResettingPassword ? (
                    <span className="flex items-center">
                      <RefreshCw className="animate-spin mr-2" size={16} />
                      Resetting...
                    </span>
                  ) : 'Reset Password'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverManagementComp;