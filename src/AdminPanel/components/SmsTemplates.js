import React, { useState, useEffect } from 'react';
import API from '../api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SmsTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    template: '',
    variables: '{customer_name}, {points}, {deal_title}, {deal_description}, {message}',
    is_active: true
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await API.get('/loyalty/sms-templates');
      setTemplates(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch templates');
      setLoading(false);
    }
  };

  const handleAddTemplate = async (e) => {
    e.preventDefault();
    try {
      await API.post('/loyalty/sms-templates', formData);
      toast.success('Template created successfully');
      setShowAddModal(false);
      setFormData({
        name: '',
        template: '',
        variables: '{customer_name}, {points}, {deal_title}, {deal_description}, {message}',
        is_active: true
      });
      fetchTemplates();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create template');
    }
  };

  const handleUpdateTemplate = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/loyalty/sms-templates/${currentTemplate.id}`, formData);
      toast.success('Template updated successfully');
      setShowEditModal(false);
      fetchTemplates();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update template');
    }
  };

  const handleDeleteTemplate = async (id) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await API.delete(`/loyalty/sms-templates/${id}`);
        toast.success('Template deleted successfully');
        fetchTemplates();
      } catch (error) {
        toast.error('Failed to delete template');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">SMS Templates</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full sm:w-auto"
        >
          Create New Template
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">Name</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">Template</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[180px]">Variables</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">Status</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {templates.length > 0 ? (
                templates.map((template) => (
                  <tr key={template.id}>
                    <td className="px-3 py-4">
                      <div className="text-sm font-medium text-gray-900">{template.name}</div>
                      <div className="text-sm text-gray-500 truncate max-w-[200px] sm:hidden mt-1">{template.template}</div>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500 hidden sm:table-cell">
                      <div className="line-clamp-2">{template.template}</div>
                    </td>
                    <td className="px-3 py-4 hidden sm:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {template.variables.split(',').map((varName, i) => (
                          <span key={i} className="bg-gray-100 px-2 py-1 text-xs rounded whitespace-nowrap">
                            {varName.trim()}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${template.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {template.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-3 py-4 space-x-2">
                      <button
                        onClick={() => {
                          setCurrentTemplate(template);
                          setFormData({
                            name: template.name,
                            template: template.template,
                            variables: template.variables,
                            is_active: template.is_active
                          });
                          setShowEditModal(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="text-red-600 hover:text-red-900 text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No templates found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Template Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <h2 className="text-xl font-bold mb-4">Create New SMS Template</h2>
              <form onSubmit={handleAddTemplate}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="template-name">
                    Template Name
                  </label>
                  <input
                    type="text"
                    id="template-name"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="template-content">
                    Template Content
                  </label>
                  <textarea
                    id="template-content"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={formData.template}
                    onChange={(e) => setFormData({ ...formData, template: e.target.value })}
                    rows="5"
                    required
                  ></textarea>
                  <p className="text-sm text-gray-500 mt-1">
                    Available variables: {formData.variables}
                  </p>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="template-variables">
                    Variables (comma separated)
                  </label>
                  <input
                    type="text"
                    id="template-variables"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={formData.variables}
                    onChange={(e) => setFormData({ ...formData, variables: e.target.value })}
                    required
                  />
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
                <div className="bg-gray-50 p-4 rounded mb-4">
                  <h3 className="font-medium mb-2">Preview:</h3>
                  <div className="bg-white p-3 border border-gray-200 rounded">
                    {formData.template
                      .replace('{customer_name}', 'John Doe')
                      .replace('{points}', '100')
                      .replace('{deal_title}', 'Summer Special')
                      .replace('{deal_description}', '50% off all items')
                      .replace('{message}', 'Your custom message here')}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4">
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

      {/* Edit Template Modal */}
      {showEditModal && currentTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <h2 className="text-xl font-bold mb-4">Edit SMS Template</h2>
              <form onSubmit={handleUpdateTemplate}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-template-name">
                    Template Name
                  </label>
                  <input
                    type="text"
                    id="edit-template-name"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-template-content">
                    Template Content
                  </label>
                  <textarea
                    id="edit-template-content"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={formData.template}
                    onChange={(e) => setFormData({ ...formData, template: e.target.value })}
                    rows="5"
                    required
                  ></textarea>
                  <p className="text-sm text-gray-500 mt-1">
                    Available variables: {formData.variables}
                  </p>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-template-variables">
                    Variables (comma separated)
                  </label>
                  <input
                    type="text"
                    id="edit-template-variables"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={formData.variables}
                    onChange={(e) => setFormData({ ...formData, variables: e.target.value })}
                    required
                  />
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
                <div className="bg-gray-50 p-4 rounded mb-4">
                  <h3 className="font-medium mb-2">Preview:</h3>
                  <div className="bg-white p-3 border border-gray-200 rounded">
                    {formData.template
                      .replace('{customer_name}', 'John Doe')
                      .replace('{points}', '100')
                      .replace('{deal_title}', 'Summer Special')
                      .replace('{deal_description}', '50% off all items')
                      .replace('{message}', 'Your custom message here')}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4">
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

export default SmsTemplates;