import React, { useState, useEffect } from 'react';
import API from '../api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { format } from 'date-fns';

const LoyaltyDeals = () => {
  const [deals, setDeals] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [currentDeal, setCurrentDeal] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [sendToAll, setSendToAll] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    is_active: true,
    is_automated: false
  });

  useEffect(() => {
    fetchDeals();
    fetchUsers();
  }, [filter]);

  const fetchDeals = async () => {
    try {
      let url = '/loyalty/deals';
      if (filter === 'active') url += '?is_active=true';
      if (filter === 'upcoming') url += '?upcoming=true';
      if (filter === 'current') url += '?current=true';
      
      const response = await API.get(url);
      setDeals(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch deals');
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await API.get('/loyalty/sms-templates');
        setTemplates(response.data);
      } catch (error) {
        toast.error('Failed to fetch templates');
      }
    };
    fetchTemplates();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await API.get('/loyalty/users');
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to fetch users');
    }
  };

  const handleAddDeal = async (e) => {
    e.preventDefault();
    try {
      await API.post('/loyalty/deals', formData);
      toast.success('Deal created successfully');
      setShowAddModal(false);
      setFormData({
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        is_active: true,
        is_automated: false
      });
      fetchDeals();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create deal');
    }
  };

  const handleUpdateDeal = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/loyalty/deals/${currentDeal.id}`, formData);
      toast.success('Deal updated successfully');
      setShowEditModal(false);
      fetchDeals();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update deal');
    }
  };

  const handleDeleteDeal = async (id) => {
    if (window.confirm('Are you sure you want to delete this deal?')) {
      try {
        await API.delete(`/loyalty/deals/${id}`);
        toast.success('Deal deleted successfully');
        fetchDeals();
      } catch (error) {
        toast.error('Failed to delete deal');
      }
    }
  };

  const handleSendDeal = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post(`/loyalty/deals/${currentDeal.id}/send`, {
        userIds: selectedUsers,
        sendToAll
      });
      
      toast.success(`Messages sent: ${response.data.sent}, Failed: ${response.data.failed}`);
      setShowSendModal(false);
      setSelectedUsers([]);
      setSendToAll(false);
    } catch (error) {
      toast.error('Failed to send deal messages');
    }
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Loyalty Deals</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Create New Deal
        </button>
      </div>

      <div className="mb-4 sm:mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 sm:px-4 sm:py-2 rounded text-sm ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          All Deals
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-3 py-1 sm:px-4 sm:py-2 rounded text-sm ${filter === 'active' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('upcoming')}
          className={`px-3 py-1 sm:px-4 sm:py-2 rounded text-sm ${filter === 'upcoming' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setFilter('current')}
          className={`px-3 py-1 sm:px-4 sm:py-2 rounded text-sm ${filter === 'current' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Current
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Description</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Start Date</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">End Date</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {deals.length > 0 ? (
                  deals.map((deal) => (
                    <tr key={deal.id}>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {deal.title}
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-sm text-gray-500 hidden sm:table-cell max-w-xs truncate">
                        {deal.description}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                        {formatDate(deal.start_date)}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                        {formatDate(deal.end_date)}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${deal.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {deal.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => {
                              setCurrentDeal(deal);
                              setFormData({
                                title: deal.title,
                                description: deal.description,
                                start_date: deal.start_date || '',
                                end_date: deal.end_date || '',
                                is_active: deal.is_active,
                                is_automated: deal.is_automated
                              });
                              setShowEditModal(true);
                            }}
                            className="text-indigo-600 hover:text-indigo-900 whitespace-nowrap"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteDeal(deal.id)}
                            className="text-red-600 hover:text-red-900 whitespace-nowrap"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => {
                              setCurrentDeal(deal);
                              setShowSendModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 whitespace-nowrap"
                          >
                            Send
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No deals found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Deal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold mb-4">Create New Deal</h2>
              <form onSubmit={handleAddDeal}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deal-title">
                    Title
                  </label>
                  <input
                    type="text"
                    id="deal-title"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deal-description">
                    Description
                  </label>
                  <textarea
                    id="deal-description"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    required
                  ></textarea>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="start-date">
                      Start Date
                    </label>
                    <input
                      type="datetime-local"
                      id="start-date"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="end-date">
                      End Date
                    </label>
                    <input
                      type="datetime-local"
                      id="end-date"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-gray-700">Active</span>
                  </label>
                </div>
                <div className="mb-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.is_automated}
                      onChange={(e) => setFormData({ ...formData, is_automated: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-gray-700">Automated (send to new users)</span>
                  </label>
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Deal Modal */}
      {showEditModal && currentDeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold mb-4">Edit Deal</h2>
              <form onSubmit={handleUpdateDeal}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-deal-title">
                    Title
                  </label>
                  <input
                    type="text"
                    id="edit-deal-title"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-deal-description">
                    Description
                  </label>
                  <textarea
                    id="edit-deal-description"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    required
                  ></textarea>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-start-date">
                      Start Date
                    </label>
                    <input
                      type="datetime-local"
                      id="edit-start-date"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-end-date">
                      End Date
                    </label>
                    <input
                      type="datetime-local"
                      id="edit-end-date"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-gray-700">Active</span>
                  </label>
                </div>
                <div className="mb-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.is_automated}
                      onChange={(e) => setFormData({ ...formData, is_automated: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-gray-700">Automated (send to new users)</span>
                  </label>
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Send Deal Modal */}
      {showSendModal && currentDeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold mb-4">Send Deal: {currentDeal.title}</h2>
              <form onSubmit={handleSendDeal}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="template">
                    SMS Template (optional)
                  </label>
                  <select
                    id="template"
                    className="w-full p-2 border border-gray-300 rounded"
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                  >
                    <option value="">-- Default Message --</option>
                    {templates.filter(t => t.is_active).map(template => (
                      <option key={template.id} value={template.id}>{template.name}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="flex items-center space-x-2 mb-4">
                    <input
                      type="checkbox"
                      checked={sendToAll}
                      onChange={(e) => setSendToAll(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-gray-700">Send to all active users</span>
                  </label>
                  
                  {!sendToAll && (
                    <div className="max-h-64 overflow-y-auto border border-gray-300 rounded p-2">
                      {users.filter(u => u.is_active).map(user => (
                        <div key={user.id} className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => toggleUserSelection(user.id)}
                            className="rounded"
                          />
                          <span className="text-sm">{user.name} ({user.phone_number})</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSendModal(false);
                      setSelectedUsers([]);
                      setSendToAll(false);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    disabled={!sendToAll && selectedUsers.length === 0}
                  >
                    Send Deal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoyaltyDeals;