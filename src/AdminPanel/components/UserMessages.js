import React, { useState, useEffect } from 'react';
import API from '../api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserMessages = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const [templates, setTemplates] = useState([])
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [loading, setLoading] = useState(true);
  const [showSendModal, setShowSendModal] = useState(false);
  const [messageContent, setMessageContent] = useState('');

  useEffect(() => {
    if (userId) {
      fetchMessages();
    }
  }, [userId]);

  const fetchMessages = async () => {
    try {
      const response = await API.get(`/loyalty/users/${userId}/messages`);
      setMessages(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch messages');
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


  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      await API.post('/loyalty/messages/send', {
        userId,
        message: messageContent
      });
      toast.success('Message sent successfully');
      setShowSendModal(false);
      setMessageContent('');
      fetchMessages();
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Messages</h2>
        <button
          onClick={() => setShowSendModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
        >
          Send Message
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : messages.length > 0 ? (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {messages.map((message) => (
                <tr key={message.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(message.sent_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs truncate">{message.message}</div>
                    {message.deal_title && (
                      <div className="text-xs text-gray-500">Deal: {message.deal_title}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${message.status === 'sent' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {message.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {message.deal_id ? 'Deal' : 'Custom'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-4 text-center text-gray-500">
          No messages found for this user
        </div>
      )}

      {/* Send Message Modal */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Send Message</h2>
              <form onSubmit={handleSendMessage}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="template">
                    Template (optional)
                  </label>
                  <select
                    id="template"
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                  >
                    <option value="">-- Custom Message --</option>
                    {templates.filter(t => t.is_active).map(template => (
                      <option key={template.id} value={template.id}>{template.name}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
                    Message
                  </label>
                  <textarea
                    id="message"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    rows="4"
                    required
                  ></textarea>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowSendModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Send
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

export default UserMessages;