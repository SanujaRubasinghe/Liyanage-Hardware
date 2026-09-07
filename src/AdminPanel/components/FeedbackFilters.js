// components/FeedbackFilters.jsx
import React from 'react';

const FeedbackFilters = ({ filters, onFiltersChange }) => {
    const handleFilterChange = (key, value) => {
        onFiltersChange(prev => ({
            ...prev,
            [key]: value,
            page: 1 // Reset to first page when filters change
        }));
    };

    return (
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex flex-wrap gap-4">
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                        Type
                    </label>
                    <select
                        value={filters.type}
                        onChange={(e) => handleFilterChange('type', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">All Types</option>
                        <option value="complaint">Complaints</option>
                        <option value="review">Reviews</option>
                    </select>
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                        Status
                    </label>
                    <select
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="resolved">Resolved</option>
                    </select>
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                        Per Page
                    </label>
                    <select
                        value={filters.limit}
                        onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default FeedbackFilters;
