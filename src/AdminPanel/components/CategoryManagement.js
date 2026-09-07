import React, { useState, useEffect } from 'react';
import { categoryService } from '../services/categoryService';
import CategoryDashboard from './CategoryDashboard';
import CategoryForm from './CategoryForm';
import CategoryList from './CategoryList';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAllCategories();
      // Transform the data to match our frontend structure
      const transformedData = data.map(category => ({
        id: category.category_id,
        name: category.name,
        description: category.description,
        image: category.img_url,
        isActive: category.is_active === 1,
        parent_category_id: category.parent_category_id,
        created_at: category.created_at,
        subcategories: [] // Will be populated from the same data
      }));

      // Organize categories and subcategories
      const categoriesMap = new Map();
      const rootCategories = [];

      transformedData.forEach(category => {
        if (!category.parent_category_id) {
          rootCategories.push(category);
          categoriesMap.set(category.id, category);
        }
      });

      transformedData.forEach(category => {
        if (category.parent_category_id) {
          const parent = categoriesMap.get(category.parent_category_id);
          if (parent) {
            parent.subcategories.push(category);
          }
        }
      });

      setCategories(rootCategories);
      setError(null);
    } catch (err) {
      setError('Failed to fetch categories');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (isEditing) {
        await categoryService.updateCategory(selectedCategory.id, formData);
      } else {
        await categoryService.createCategory(formData);
      }
      await fetchCategories();
      resetForm();
    } catch (err) {
      setError('Failed to save category');
      console.error('Error saving category:', err);
    }
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setIsEditing(true);
    setActiveView('form');
  };

  const handleDelete = async (categoryId) => {
    try {
      await categoryService.deleteCategory(categoryId);
      await fetchCategories();
    } catch (err) {
      setError('Failed to delete category');
      console.error('Error deleting category:', err);
    }
  };

  const handleAddSubcategory = async (categoryId, subcategoryData) => {
    try {
      await categoryService.createCategory({
        ...subcategoryData,
        parent_category_id: categoryId
      });
      await fetchCategories();
    } catch (err) {
      setError('Failed to add subcategory');
      console.error('Error adding subcategory:', err);
    }
  };

  const handleDeleteSubcategory = async (categoryId, subcategoryId) => {
    try {
      await categoryService.deleteCategory(subcategoryId);
      await fetchCategories();
    } catch (err) {
      setError('Failed to delete subcategory');
      console.error('Error deleting subcategory:', err);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setSelectedCategory(null);
    setActiveView('list');
  };

  const renderContent = () => {
    if (loading) {
      return <div className="text-center py-4">Loading...</div>;
    }

    if (error) {
      return <div className="text-center text-red-600 py-4">{error}</div>;
    }

    switch (activeView) {
      case 'dashboard':
        return <CategoryDashboard categories={categories} />;
      case 'form':
        return (
          <CategoryForm
            onSubmit={handleSubmit}
            initialData={selectedCategory}
            isEditing={isEditing}
            onCancel={resetForm}
          />
        );
      case 'list':
        return (
          <CategoryList
            categories={categories}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAddSubcategory={handleAddSubcategory}
            onDeleteSubcategory={handleDeleteSubcategory}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
        <div className="mt-4 flex space-x-4">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`px-4 py-2 rounded-md ${
              activeView === 'dashboard'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveView('list')}
            className={`px-4 py-2 rounded-md ${
              activeView === 'list'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => {
              resetForm();
              setActiveView('form');
            }}
            className={`px-4 py-2 rounded-md ${
              activeView === 'form'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Add Category
          </button>
        </div>
      </div>
      {renderContent()}
    </div>
  );
};

export default CategoryManagement; 