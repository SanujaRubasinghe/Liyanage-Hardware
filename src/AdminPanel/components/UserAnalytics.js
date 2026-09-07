import React, { useState, useEffect } from 'react';
import API from '../api';
import { toast } from 'react-toastify';

const UserAnalytics = ({ isOpen, onClose, userId }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && userId) {
      fetchAnalytics();
    }
  }, [isOpen, userId]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/users/${userId}/analytics`);
      setAnalytics(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch user analytics');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">User Analytics</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          {loading ? (
            <div className="text-center py-8">Loading analytics...</div>
          ) : (
            <div>
              {/* User Stats */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-medium mb-4">User Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded shadow">
                    <p className="text-sm text-gray-500">Total Logins</p>
                    <p className="text-2xl font-bold">{analytics.userStats.total_logins}</p>
                  </div>
                  <div className="bg-white p-4 rounded shadow">
                    <p className="text-sm text-gray-500">Successful Logins</p>
                    <p className="text-2xl font-bold">{analytics.userStats.successful_logins}</p>
                  </div>
                  <div className="bg-white p-4 rounded shadow">
                    <p className="text-sm text-gray-500">Failed Logins</p>
                    <p className="text-2xl font-bold">{analytics.userStats.failed_logins}</p>
                  </div>
                  <div className="bg-white p-4 rounded shadow">
                    <p className="text-sm text-gray-500">Last Login</p>
                    <p className="text-xl font-bold">
                      {analytics.userStats.last_login ? 
                        new Date(analytics.userStats.last_login).toLocaleString() : 'Never'}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Login History */}
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Recent Login History</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Login Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {analytics.loginHistory.map((login) => (
                        <tr key={login.login_id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(login.login_time).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {login.ip_address}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${login.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {login.success ? 'Success' : 'Failed'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {login.user_agent?.split(' ')[0] || 'Unknown'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Activity Logs */}
              <div>
                <h3 className="text-lg font-medium mb-4">Recent Activity Logs</h3>
                <div className="space-y-4">
                  {analytics.activityLogs.map((log) => (
                    <div key={log.log_id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between">
                        <p className="font-medium capitalize">{log.activity_type.replace('_', ' ')}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(log.created_at).toLocaleString()}
                        </p>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">{log.description}</p>
                      <div className="mt-2 flex text-xs text-gray-500 space-x-4">
                        <span>IP: {log.ip_address}</span>
                        <span>Device: {log.user_agent?.split(' ')[0] || 'Unknown'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserAnalytics;