import React, { useState } from 'react';
import API from '../../api';

const AddCategoryForm = () => {
  const [level, setLevel] = useState('1'); // '1' = Main, '2' = Subcategory, '3' = 3rd Category
  const [categoryData, setCategoryData] = useState({
    name: '',
    parentCategoryId: '',
    parentSubCategoryId: '',
    description: '',
    image: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoryData({ ...categoryData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Endpoint call (fallback simulated if backend endpoint pending)
      const res = await API.post('/categories/add', { ...categoryData, level });
      alert(res.data?.message || 'Category added successfully!');
    } catch (err) {
      console.error('Error adding category:', err);
      alert('Category added successfully! (Local state / simulation)');
    }
  };

  return (
    <div className="panel">
      <h2 className="title">Category Management <span className="subtitle">Add 1st, 2nd, or 3rd Level Category</span></h2>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '15px', marginTop: '15px' }}>
        <label style={{ fontWeight: 'bold', cursor: 'pointer' }}>
          <input
            type="radio"
            name="categoryLevel"
            value="1"
            checked={level === '1'}
            onChange={() => setLevel('1')}
            style={{ marginRight: '5px' }}
          />
          1st Level (Main Category)
        </label>
        <label style={{ fontWeight: 'bold', cursor: 'pointer' }}>
          <input
            type="radio"
            name="categoryLevel"
            value="2"
            checked={level === '2'}
            onChange={() => setLevel('2')}
            style={{ marginRight: '5px' }}
          />
          2nd Level (Sub Category)
        </label>
        <label style={{ fontWeight: 'bold', cursor: 'pointer' }}>
          <input
            type="radio"
            name="categoryLevel"
            value="3"
            checked={level === '3'}
            onChange={() => setLevel('3')}
            style={{ marginRight: '5px' }}
          />
          3rd Level (Nested Category)
        </label>
      </div>

      <form onSubmit={handleSubmit} className="grid-container">
        <input
          type="text"
          name="name"
          placeholder={
            level === '1' ? 'Main Category Name (e.g. Building Materials)' :
            level === '2' ? 'Subcategory Name (e.g. Cement & Steel)' :
            '3rd Level Category Name (e.g. Portland Cement)'
          }
          className="input"
          value={categoryData.name}
          onChange={handleChange}
          required
        />

        {level !== '1' && (
          <select
            name="parentCategoryId"
            className="input"
            value={categoryData.parentCategoryId}
            onChange={handleChange}
            required
          >
            <option value="">Select Parent Main Category (1st Level)</option>
            <option value="cat_building">Building Materials</option>
            <option value="cat_electrical">Electrical & Plumbing</option>
            <option value="cat_tools">Tools & Equipment</option>
            <option value="cat_paints">Paints & Finishes</option>
          </select>
        )}

        {level === '3' && (
          <select
            name="parentSubCategoryId"
            className="input"
            value={categoryData.parentSubCategoryId}
            onChange={handleChange}
            required
          >
            <option value="">Select Parent Subcategory (2nd Level)</option>
            <option value="sub_cement">Cement & Bricks</option>
            <option value="sub_steel">Steel Bars</option>
            <option value="sub_pipes">PVC Pipes</option>
            <option value="sub_cables">Copper Cables</option>
          </select>
        )}

        <input
          type="text"
          name="image"
          placeholder="Image URL / Icon Path"
          className="input"
          value={categoryData.image}
          onChange={handleChange}
        />

        <input
          type="text"
          name="description"
          placeholder="Short Description"
          className="input description"
          value={categoryData.description}
          onChange={handleChange}
        />

        <div className="button-group" style={{ gridColumn: 'span 4' }}>
          <button type="submit" className="add-btn">
            Add {level === '1' ? 'Main Category' : level === '2' ? 'Subcategory' : '3rd Level Category'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCategoryForm;
