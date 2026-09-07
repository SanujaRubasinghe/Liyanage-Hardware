import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../api';

const SendLoyaltyDealModal = ({ show, onClose, onSuccess, deal }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [sendToAll, setSendToAll] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (show) {
      fetchUsers();
    }
  }, [show]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await API.get('/loyalty/users');
      const data = response.data;
      setUsers(data);
    } catch (error) {
      toast.error('Failed to load users');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (userId) => {
    setSelectedUserIds(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sendToAll && selectedUserIds.length === 0) {
      toast.error('Please select at least one member or choose "Send to all"');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await API.post(`/loyalty/deals/${deal.id}/send`, 
        {
          userIds: selectedUserIds,
          sendToAll
        }
      );
      
      if (response.status !== 200) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send deal');
      }
      
      const result = response.data;
      onSuccess();
      toast.success(`Sent to ${result.sent} members, ${result.failed} failed`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone_number.includes(searchTerm)
  );

  if (!show || !deal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-2">Send Deal: {deal.title}</h2>
          <p className="text-gray-600 mb-4">{deal.description}</p>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Search Members
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Search by name or phone..."
            />
          </div>
          
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="sendToAll"
              checked={sendToAll}
              onChange={(e) => setSendToAll(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="sendToAll" className="ml-2 block text-sm text-gray-700">
              Send to all active members ({users.filter(u => u.is_active).length})
            </label>
          </div>
          
          {!sendToAll && (
            <div className="max-h-96 overflow-y-auto mb-4 border rounded-md">
              {loading ? (
                <div className="p-4 flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : filteredUsers.length === 0 ? (
                <p className="p-4 text-gray-500">No members found</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {filteredUsers.map(user => (
                    <li key={user.id} className="p-3 hover:bg-gray-50">
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedUserIds.includes(user.id)}
                          onChange={() => handleUserSelect(user.id)}
                          disabled={!user.is_active}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <div>
                          <p className={`text-sm font-medium ${user.is_active ? 'text-gray-900' : 'text-gray-400'}`}>
                            {user.name}
                            {!user.is_active && ' (Inactive)'}
                          </p>
                          <p className="text-xs text-gray-500">{user.phone_number} • {user.points} pts</p>
                        </div>
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Deal'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendLoyaltyDealModal;