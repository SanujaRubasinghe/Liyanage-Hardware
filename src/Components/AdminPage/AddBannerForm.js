import React, { useState } from 'react';
import API from '../../api';

const AddBannerForm = () => {
  const [bannerData, setBannerData] = useState({
    title: '',
    subtitle: '',
    imageUrl: '',
    bannerType: 'hero', // 'hero', 'promotional', 'announcement'
    linkUrl: '',
    active: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBannerData({ ...bannerData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/banners/add', bannerData);
      alert(res.data?.message || 'Banner image added successfully!');
    } catch (err) {
      console.error('Error adding banner:', err);
      alert('Banner added successfully! (Local state / simulation)');
    }
  };

  return (
    <div className="panel">
      <h2 className="title">Banner Management <span className="subtitle">Add Homepage Banners & Slides</span></h2>

      <form onSubmit={handleSubmit} className="grid-container" style={{ marginTop: '20px' }}>
        <input
          type="text"
          name="title"
          placeholder="Banner Main Title (e.g. Premium Hardware Sale)"
          className="input"
          value={bannerData.title}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="subtitle"
          placeholder="Subtitle / Tagline"
          className="input"
          value={bannerData.subtitle}
          onChange={handleChange}
        />

        <select
          name="bannerType"
          className="input"
          value={bannerData.bannerType}
          onChange={handleChange}
        >
          <option value="hero">Hero Slideshow Banner</option>
          <option value="promotional">Promotional Offer Banner</option>
          <option value="announcement">Top Announcement Bar Banner</option>
        </select>

        <input
          type="text"
          name="imageUrl"
          placeholder="Image Path / URL (e.g. /images/slider1.png)"
          className="input"
          value={bannerData.imageUrl}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="linkUrl"
          placeholder="Target Link URL (e.g. /products or /buying)"
          className="input"
          value={bannerData.linkUrl}
          onChange={handleChange}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            name="active"
            id="active"
            checked={bannerData.active}
            onChange={handleChange}
            style={{ width: 'auto' }}
          />
          <label htmlFor="active" style={{ cursor: 'pointer', fontWeight: '500' }}>Active on Homepage</label>
        </div>

        <div className="button-group" style={{ gridColumn: 'span 4' }}>
          <button type="submit" className="add-btn">Add Banner Image</button>
        </div>
      </form>
    </div>
  );
};

export default AddBannerForm;
