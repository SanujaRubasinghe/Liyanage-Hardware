import React, { useState, useEffect } from 'react';
import API from '../api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserRewards = ({ userId }) => {
  const [rewardsData, setRewardsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchRewardsData();
    }
  }, [userId]);

  const fetchRewardsData = async () => {
    try {
      const response = await API.get(`/loyalty/users/${userId}/points`);
      setRewardsData(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch rewards data');
      setLoading(false);
    }
  };

  const handleClaimReward = async (rewardId) => {
    try {
      await API.post(`/loyalty/users/${userId}/rewards/${rewardId}/claim`);
      toast.success('Reward claimed successfully');
      fetchRewardsData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to claim reward');
    }
  };

  const handleRedeemReward = async (rewardClaimId) => {
    try {
      await API.put(`/loyalty/rewards/${rewardClaimId}/redeem`);
      toast.success('Reward marked as redeemed');
      fetchRewardsData();
    } catch (error) {
      toast.error('Failed to redeem reward');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!rewardsData) {
    return <div className="text-center text-gray-500">No rewards data available</div>;
  }

  return (
    <div className="mt-8">
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">Loyalty Points</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded">
            <h3 className="text-sm font-medium text-blue-800">Current Points</h3>
            <p className="text-3xl font-bold text-blue-600">{rewardsData.user.points}</p>
          </div>
          <div className="bg-green-50 p-4 rounded">
            <h3 className="text-sm font-medium text-green-800">Total Visits</h3>
            <p className="text-3xl font-bold text-green-600">{rewardsData.user.visits}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded">
            <h3 className="text-sm font-medium text-purple-800">Last Visit</h3>
            <p className="text-3xl font-bold text-purple-600">
              {rewardsData.user.last_visit ? new Date(rewardsData.user.last_visit).toLocaleDateString() : 'Never'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Available Rewards</h2>
          {rewardsData.availableRewards.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {rewardsData.availableRewards.map((reward) => (
                <li key={reward.id} className="py-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium">{reward.name}</h3>
                      <p className="text-sm text-gray-500">{reward.description}</p>
                      <p className="text-sm font-semibold text-blue-600">{reward.points_required} points</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedReward(reward);
                        setShowClaimModal(true);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Claim
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No available rewards</p>
          )}
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Claimed Rewards</h2>
          {rewardsData.claimedRewards.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {rewardsData.claimedRewards.map((reward) => (
                <li key={reward.id} className="py-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium">{reward.name}</h3>
                      <p className="text-sm text-gray-500">{reward.description}</p>
                      <p className="text-sm text-gray-500">
                        Claimed on: {new Date(reward.claimed_at).toLocaleDateString()}
                      </p>
                      <p className="text-sm font-semibold text-blue-600">{reward.points_required} points</p>
                    </div>
                    {!reward.is_redeemed ? (
                      <button
                        onClick={() => handleRedeemReward(reward.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Mark as Redeemed
                      </button>
                    ) : (
                      <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded">
                        Redeemed
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No claimed rewards</p>
          )}
        </div>
      </div>

      {/* Claim Reward Confirmation Modal */}
      {showClaimModal && selectedReward && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Claim Reward</h2>
              <p className="mb-4">Are you sure you want to claim <strong>{selectedReward.name}</strong> for {selectedReward.points_required} points?</p>
              <p className="mb-4">Your current points: {rewardsData.user.points}</p>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowClaimModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleClaimReward(selectedReward.id);
                    setShowClaimModal(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserRewards;