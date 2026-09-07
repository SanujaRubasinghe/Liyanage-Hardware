// BannerList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BannerCard from './BannerCard';
import { motion } from 'framer-motion';

import API from '../api';

const BannerList = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await API.get('/banners');
        setBanners(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  const handleDelete = async (bannerId) => {
    try {
      await API.delete(`/banners/${bannerId}`);
      setBanners(banners.filter(banner => banner.banner_id !== bannerId));
    } catch (err) {
      console.error('Error deleting banner:', err);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Banner Management</h1>
        <Link
          to="/banners/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          Add New Banner
        </Link>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
       {banners.map((banner, index) => {
            if (!banner.banner_id) {
                console.error("Missing banner_id for banner:", banner);
                return null;
            }
            return (
                <BannerCard
                key={banner.banner_id || `banner-${index}`}
                banner={banner}
                onDelete={handleDelete}
                />
            );
        })}
      </motion.div>
    </div>
  );
};

export default BannerList;