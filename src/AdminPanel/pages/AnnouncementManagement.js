import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API from '../api';
import { motion } from 'framer-motion';

const AnnouncementManager = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    is_active: true,
    start_date: '',
    end_date: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setIsLoading(true);
    try {
      const response = await API.get('/announcements');
      setAnnouncements(response.data);
    } catch (error) {
      toast.error('Failed to fetch announcements');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate dates
    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      
      if (endDate <= startDate) {
        toast.error('End date must be after start date');
        return;
      }
    }

    try {
      // Convert local datetime to MySQL format (without timezone conversion)
      const localToMySQLFormat = (localDatetime) => {
        if (!localDatetime) return null;
        const date = new Date(localDatetime);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:00`;
      };

      const payload = {
        ...formData,
        start_date: localToMySQLFormat(formData.start_date),
        end_date: localToMySQLFormat(formData.end_date)
      };

      if (editingId) {
        await API.put(`/announcements/${editingId}`, payload);
        toast.success('Announcement updated successfully');
      } else {
        await API.post('/announcements', payload);
        toast.success('Announcement created successfully');
      }

      // Reset form
      setFormData({
        title: '',
        content: '',
        is_active: true,
        start_date: '',
        end_date: ''
      });
      setEditingId(null);
      fetchAnnouncements();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving announcement');
    }
  };

  const handleEdit = (announcement) => {
    const utcToLocalDatetime = (utcString) => {
      if (!utcString) return '';
      const date = new Date(utcString);
      // Convert to format needed by datetime-local (YYYY-MM-DDTHH:MM)
      const localISO = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
      return localISO.slice(0, 16);
    };

    setFormData({
      title: announcement.title,
      content: announcement.content,
      is_active: announcement.is_active,
      start_date: utcToLocalDatetime(announcement.start_date),
      end_date: utcToLocalDatetime(announcement.end_date)
    });
    setEditingId(announcement.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        await API.delete(`/announcements/${id}`);
        toast.success('Announcement deleted successfully');
        fetchAnnouncements();
      } catch (error) {
        toast.error('Failed to delete announcement');
      }
    }
  };

  const formatDisplayDateTime = (utcString) => {
    if (!utcString) return 'Not set';
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZoneName: 'short'
    };
    return new Date(utcString).toLocaleString('en-US', options);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-md p-6 mb-8"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {editingId ? 'Edit Announcement' : 'Create New Announcement'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date/Time</label>
              <input
                type="datetime-local"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date/Time</label>
              <input
                type="datetime-local"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">Active</label>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    title: '',
                    content: '',
                    is_active: true,
                    start_date: '',
                    end_date: ''
                  });
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
            >
              {editingId ? 'Update' : 'Create'} Announcement
            </button>
          </div>
        </form>
      </motion.div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Announcements</h2>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No announcements found
          </div>
        ) : (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{announcement.title}</h3>
                    <p className="text-gray-600 mt-1">{announcement.content}</p>
                    <div className="flex flex-wrap gap-2 mt-2 text-sm">
                      <span className={`px-2 py-1 rounded-full ${announcement.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {announcement.is_active ? 'Active' : 'Inactive'}
                      </span>
                      {announcement.start_date && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                          Starts: {formatDisplayDateTime(announcement.start_date)}
                        </span>
                      )}
                      {announcement.end_date && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                          Ends: {formatDisplayDateTime(announcement.end_date)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(announcement)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(announcement.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementManager;