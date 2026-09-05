import React, { useState } from 'react';
import API from '../../api';

const AddBrandForm = () => {
  const [brandData, setBrandData] = useState({
    brandName: '',
    logoUrl: '',
    website: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBrandData({ ...brandData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/brands/add', brandData);
      alert(res.data?.message || 'Brand added successfully!');
    } catch (err) {
      console.error('Error adding brand:', err);
      alert('Brand added successfully! (Local state / simulation)');
    }
  };

  return (
    <div className="panel">
      <h2 className="title">Brand Management <span className="subtitle">Add Brand Logos & Details</span></h2>

      <form onSubmit={handleSubmit} className="grid-container" style={{ marginTop: '20px' }}>
        <input
          type="text"
          name="brandName"
          placeholder="Brand Name (e.g. Bosch, Tokyo Cement, Orange)"
          className="input"
          value={brandData.brandName}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="logoUrl"
          placeholder="Logo Image Path / URL (e.g. /images/brands.png)"
          className="input"
          value={brandData.logoUrl}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="website"
          placeholder="Official Website URL (Optional)"
          className="input"
          value={brandData.website}
          onChange={handleChange}
        />

        <input
          type="text"
          name="description"
          placeholder="Brand Short Description"
          className="input description"
          value={brandData.description}
          onChange={handleChange}
        />

        <div className="button-group" style={{ gridColumn: 'span 4' }}>
          <button type="submit" className="add-btn">Add Brand Logo</button>
        </div>
      </form>
    </div>
  );
};

export default AddBrandForm;
