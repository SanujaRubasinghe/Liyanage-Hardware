import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiEdit, FiTrash2, FiPlus, FiChevronDown, FiChevronRight, FiImage } from 'react-icons/fi';
import { ToastContainer } from 'react-toastify';
import API from '../api';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await API.get('/categories');
      setCategories(data.categories);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch categories');
      setLoading(false);
    }
  };

  const toggleExpand = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const deleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await API.delete(`/categories/${id}`);
        toast.success('Category deleted successfully');
        fetchCategories();
      } catch (error) {
        toast.error('Failed to delete category');
      }
    }
  };

  const renderCategories = (parentId = null, level = 0) => {
    return categories
      .filter(category => category.parent_category_id === parentId)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(category => {
        const hasChildren = categories.some(c => c.parent_category_id === category.category_id);
        const isExpanded = expandedCategories[category.category_id];
        
        return (
          <div key={category.category_id} className={`ml-${level * 4}`}>
            <ToastContainer position="top-right" autoClose={3000} />
            <div className={`flex items-center justify-between p-3 mb-2 rounded-lg ${level === 0 ? 'bg-indigo-50' : level === 1 ? 'bg-purple-50' : 'bg-pink-50'}`}>
              <div className="flex items-center">
                {hasChildren && (
                  <button 
                    onClick={() => toggleExpand(category.category_id)}
                    className="mr-2 text-gray-500 hover:text-gray-700"
                  >
                    {isExpanded ? <FiChevronDown /> : <FiChevronRight />}
                  </button>
                )}
                {!hasChildren && <div className="w-6 mr-2"></div>}
                
                {category.thumbnail ? (
                  <img 
                    src={`${process.env.REACT_APP_API_BASE_URL}${category.thumbnail}`} 
                    alt={category.name} 
                    className="w-10 h-10 object-cover rounded-md mr-3"
                  />
                ) : (
                  <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-md mr-3">
                    <FiImage className="text-gray-400" />
                  </div>
                )}
                
                <div>
                  <h3 className="font-medium text-gray-800">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.category_id} • {category.level} • {category.slug}</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Link 
                  to={`/categories/edit/${category.category_id}`}
                  className="p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 rounded-full transition-colors"
                >
                  <FiEdit />
                </Link>
                <button
                  onClick={() => deleteCategory(category.category_id)}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
            
            {hasChildren && isExpanded && (
              <div className="pl-6 border-l-2 border-gray-200">
                {renderCategories(category.category_id, level + 1)}
              </div>
            )}
          </div>
        );
      });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Category Management</h1>
        <Link
          to="/categories/add"
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <FiPlus className="mr-2" />
          Add Category
        </Link>
      </div>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No categories found</p>
            <Link
              to="/categories/add"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <FiPlus className="mr-2" />
              Add Your First Category
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {renderCategories()}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryList;