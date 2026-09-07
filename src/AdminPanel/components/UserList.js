import React, { useState, useEffect } from 'react';
import API from "../api"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserModal from './UserModal';
import UserAnalytics from './UserAnalytics';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    adminUsers: 0,
    newUsers: 0
  });

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await API.get('/users');
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch users');
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await API.get('/users/stats/overall');
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to fetch statistics');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await API.delete(`/users/${userId}`);
        toast.success('User deleted successfully');
        fetchUsers();
        fetchStats();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleViewAnalytics = (user) => {
    setSelectedUser(user);
    setIsAnalyticsOpen(true);
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSave = async (userData) => {
    try {
      if (selectedUser) {
        await API.put(`/users/${selectedUser.user_id}`, userData);
        toast.success('User updated successfully');
      } else {
        await API.post('/users', userData);
        toast.success('User created successfully');
      }
      fetchUsers();
      fetchStats();
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save user');
    }
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">User Management</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-gray-500 text-xs sm:text-sm font-medium">Total Users</h3>
          <p className="text-xl sm:text-2xl font-bold">{stats.totalUsers}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-gray-500 text-xs sm:text-sm font-medium">Active Users</h3>
          <p className="text-xl sm:text-2xl font-bold">{stats.activeUsers}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-gray-500 text-xs sm:text-sm font-medium">Admin Users</h3>
          <p className="text-xl sm:text-2xl font-bold">{stats.adminUsers}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-gray-500 text-xs sm:text-sm font-medium">New Users (7d)</h3>
          <p className="text-xl sm:text-2xl font-bold">{stats.newUsers}</p>
        </div>
      </div>
      
      {/* Search and Add User */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <button
          onClick={handleAddUser}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center w-full sm:w-auto justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Add User
        </button>
      </div>
      
      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Joined</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.user_id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-gray-600">{user.first_name.charAt(0)}{user.last_name.charAt(0)}</span>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{user.first_name} {user.last_name}</div>
                            <div className="text-xs text-gray-500 sm:hidden">@{user.username}</div>
                            <div className="text-xs text-gray-500 sm:hidden">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 hidden sm:table-cell">
                        <div className="truncate max-w-[160px]">{user.email}</div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 hidden md:table-cell">
                        {user.phone || '-'}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 hidden sm:table-cell">
                        {user.is_admin ? 'Admin' : 'Customer'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 hidden md:table-cell">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 space-x-2">
                        <button
                          onClick={() => handleViewAnalytics(user)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Analytics"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(user.user_id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* User Modal */}
      <UserModal 
        isOpen={isModalOpen} 
        onClose={handleModalClose} 
        user={selectedUser} 
        onSave={handleSave} 
      />
      
      {/* Analytics Modal */}
      <UserAnalytics 
        isOpen={isAnalyticsOpen} 
        onClose={() => setIsAnalyticsOpen(false)} 
        userId={selectedUser?.user_id} 
      />
    </div>
  );
};

export default UserList;