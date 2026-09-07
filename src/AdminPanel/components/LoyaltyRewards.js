import React, { useState, useEffect } from 'react';
import API from '../api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoyaltyRewards = () => {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentReward, setCurrentReward] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    points_required: '',
    description: '',
    is_active: true
  });

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      const response = await API.get('/loyalty/rewards');
      setRewards(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch rewards');
      setLoading(false);
    }
  };

  const handleAddReward = async (e) => {
    e.preventDefault();
    try {
      await API.post('/loyalty/rewards', formData);
      toast.success('Reward added successfully');
      setShowAddModal(false);
      setFormData({
        name: '',
        points_required: '',
        description: '',
        is_active: true
      });
      fetchRewards();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add reward');
    }
  };

  const handleUpdateReward = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/loyalty/rewards/${currentReward.id}`, formData);
      toast.success('Reward updated successfully');
      setShowEditModal(false);
      fetchRewards();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update reward');
    }
  };

  const handleDeleteReward = async (id) => {
    if (window.confirm('Are you sure you want to delete this reward?')) {
      try {
        await API.delete(`/loyalty/rewards/${id}`);
        toast.success('Reward deleted successfully');
        fetchRewards();
      } catch (error) {
        toast.error('Failed to delete reward');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Loyalty Rewards</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Add New Reward
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points Required</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rewards.length > 0 ? (
                rewards.map((reward) => (
                  <tr key={reward.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{reward.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{reward.points_required}</td>
                    <td className="px-6 py-4">{reward.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${reward.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {reward.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <button
                        onClick={() => {
                          setCurrentReward(reward);
                          setFormData({
                            name: reward.name,
                            points_required: reward.points_required,
                            description: reward.description,
                            is_active: reward.is_active
                          });
                          setShowEditModal(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteReward(reward.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No rewards found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Reward Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Add New Reward</h2>
              <form onSubmit={handleAddReward}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reward-name">
                    Name
                  </label>
                  <input
                    type="text"
                    id="reward-name"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="points-required">
                    Points Required
                  </label>
                  <input
                    type="number"
                    id="points-required"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={formData.points_required}
                    onChange={(e) => setFormData({ ...formData, points_required: e.target.value })}
                    min="1"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reward-description">
                    Description
                  </label>
                  <textarea
                    id="reward-description"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                  ></textarea>
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
                <div className="flex justify-end space-x-4">
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
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Reward Modal */}
      {showEditModal && currentReward && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Edit Reward</h2>
              <form onSubmit={handleUpdateReward}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-reward-name">
                    Name
                  </label>
                  <input
                    type="text"
                    id="edit-reward-name"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-points-required">
                    Points Required
                  </label>
                  <input
                    type="number"
                    id="edit-points-required"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={formData.points_required}
                    onChange={(e) => setFormData({ ...formData, points_required: e.target.value })}
                    min="1"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-reward-description">
                    Description
                  </label>
                  <textarea
                    id="edit-reward-description"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                  ></textarea>
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
                <div className="flex justify-end space-x-4">
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
    </div>
  );
};

export default LoyaltyRewards;