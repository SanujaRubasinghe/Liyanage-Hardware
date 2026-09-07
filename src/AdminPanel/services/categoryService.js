import API from "../api";

export const categoryService = {
  // Get all categories
  getAllCategories: async () => {
    try {
      const response = await API.get(`/categories`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get a single category
  getCategory: async (id) => {
    try {
      const response = await API.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create a new category
  createCategory: async (categoryData) => {
    try {
      const response = await API.post(`/categories`, {
        name: categoryData.name,
        description: categoryData.description,
        parent_category_id: categoryData.parent_category_id || null,
        is_active: categoryData.isActive ? 1 : 0,
        img_url: categoryData.image
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update a category
  updateCategory: async (id, categoryData) => {
    try {
      const response = await API.put(`/categories/${id}`, {
        name: categoryData.name,
        description: categoryData.description,
        parent_category_id: categoryData.parent_category_id || null,
        is_active: categoryData.isActive ? 1 : 0,
        img_url: categoryData.image
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete a category
  deleteCategory: async (id) => {
    try {
      const response = await API.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}; 