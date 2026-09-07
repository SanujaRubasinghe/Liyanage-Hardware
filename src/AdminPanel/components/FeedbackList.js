import React from 'react';

const FeedbackList = ({
    feedbacks,
    loading,
    pagination,
    onStatusUpdate,
    onDelete,
    onViewDetails,
    onPageChange
}) => {
    const getStatusBadge = (status) => {
        const statusClasses = {
            pending: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
            resolved: 'bg-blue-100 text-blue-800'
        };

        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const getTypeBadge = (type) => {
        const typeClasses = {
            complaint: 'bg-red-100 text-red-800',
            review: 'bg-blue-100 text-blue-800'
        };

        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${typeClasses[type]}`}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
        );
    };

    const renderStars = (rating) => {
        if (!rating) return null;
        
        return (
            <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                    <svg
                        key={i}
                        className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
                <span className="ml-1 text-sm text-gray-600">({rating})</span>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Feedback
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                                Type
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                Date
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {feedbacks.map((feedback) => (
                            <tr key={feedback.id} className="hover:bg-gray-50">
                                <td className="px-4 py-4">
                                    <div className="flex items-start space-x-3">
                                        {feedback.image_path && (
                                            <img
                                                src={`${process.env.REACT_APP_API_BASE_URL}${feedback.image_path}`}
                                                alt="Feedback attachment"
                                                className="w-10 h-10 rounded-lg object-cover"
                                            />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {feedback.title}
                                            </p>
                                            <p className="text-sm text-gray-500 truncate">
                                                {feedback.content}
                                            </p>
                                            {feedback.rating && renderStars(feedback.rating)}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap hidden sm:table-cell">
                                    {getTypeBadge(feedback.type)}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    {getStatusBadge(feedback.status)}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                                    {new Date(feedback.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => onViewDetails(feedback)}
                                            className="text-blue-600 hover:text-blue-900 whitespace-nowrap"
                                        >
                                            View
                                        </button>
                                        {feedback.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => onStatusUpdate(feedback.id, 'approved')}
                                                    className="text-green-600 hover:text-green-900 whitespace-nowrap"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => onStatusUpdate(feedback.id, 'rejected')}
                                                    className="text-red-600 hover:text-red-900 whitespace-nowrap"
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                        <button
                                            onClick={() => onDelete(feedback.id)}
                                            className="text-red-600 hover:text-red-900 whitespace-nowrap"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="px-4 py-3 sm:px-6 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 gap-4">
                    <div className="text-sm text-gray-700">
                        Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                        {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                        {pagination.total} results
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => onPageChange(pagination.page - 1)}
                            disabled={pagination.page === 1}
                            className="px-3 py-1.5 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <div className="flex flex-wrap gap-2">
                            {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                                let pageNum;
                                if (pagination.totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (pagination.page <= 3) {
                                    pageNum = i + 1;
                                } else if (pagination.page >= pagination.totalPages - 2) {
                                    pageNum = pagination.totalPages - 4 + i;
                                } else {
                                    pageNum = pagination.page - 2 + i;
                                }

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => onPageChange(pageNum)}
                                        className={`px-3 py-1.5 text-sm font-medium rounded-md min-w-[36px] ${
                                            pagination.page === pageNum
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>
                        <button
                            onClick={() => onPageChange(pagination.page + 1)}
                            disabled={pagination.page === pagination.totalPages}
                            className="px-3 py-1.5 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeedbackList;