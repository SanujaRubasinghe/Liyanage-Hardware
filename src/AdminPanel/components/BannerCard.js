// BannerCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const BannerCard = ({ banner, onDelete }) => {

    const BASE_URL = process.env.REACT_APP_API_BASE_URL
    
    const handleDeleteClick = (e) => {
        e.preventDefault();
        if (window.confirm('Are you sure you want to delete this banner?')) {
        onDelete(banner.banner_id);
        }
    };

    return (
        <motion.div 
        whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
        className="bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300"
        >
        <div className="relative">
            <img 
            src={`${BASE_URL}${banner.image_url}`} 
            alt={banner.title} 
            className="w-full h-48 object-cover"
            />
            <div className="absolute top-2 right-2 flex space-x-2">
            <Link 
                to={`/banners/edit/${banner.banner_id}`}
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors duration-300"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            </Link>
            <button 
                onClick={handleDeleteClick}
                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors duration-300"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
            </div>
        </div>
        <div className="p-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{banner.title}</h3>
            <p className="text-gray-600 mb-4">{banner.subtitle}</p>
            <div className="flex justify-between items-center">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${banner.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {banner.is_active ? 'Active' : 'Inactive'}
            </span>
            <span className="text-sm text-gray-500">
                {banner.active_schedules > 0 ? `${banner.active_schedules} schedules` : 'No schedules'}
            </span>
            </div>
        </div>
        </motion.div>
    );
};

export default BannerCard;