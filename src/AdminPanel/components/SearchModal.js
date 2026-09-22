import { useState, useEffect, useRef } from 'react';
import API from '../api';
import { debounce } from 'lodash';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

// Define all searchable sections
const SEARCH_SECTIONS = {
  products: {
    title: 'Products',
    path: '/products',
    icon: '📦'
  },
  users: {
    title: 'Users',
    path: '/users',
    icon: '👥'
  },
  banners: {
    title: 'Banners',
    path: '/cms/banners/slider',
    icon: '🎯'
  },
  offerSection: {
    title: 'Offer Items Section',
    path: '/cms/offers',
    icon: '🔥'
  },
  categories: {
    title: 'Categories',
    path: '/categories',
    icon: '📑'
  },
  orders: {
    title: 'Orders',
    path: '/orders/list',
    icon: '🛒'
  },
  orderDashboard: {
    title: 'Order Dashboard',
    path: '/orders/dashboard',
    icon: '📈'
  },
  orderMap: {
    title: 'Order Map',
    path: '/orders/map',
    icon: '🗺️'
  },
  settings: {
    title: 'Settings',
    path: '/settings',
    icon: '⚙️'
  },
  analytics: {
    title: 'Analytics',
    path: '/analytics',
    icon: '📊'
  },
  feedback: {
    title: 'Feedback',
    path: '/feedback',
    icon: '🗣️'
  },
};

export default function SearchModal({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({});
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [recents, setRecents] = useState([]);
  const modalRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const recentKey = 'global_search_recent';

  // Debounced API fetch
  const fetchResults = debounce(async (q) => {
    if (q.length < 2) return setResults({});
    const res = await API.get(`/search?q=${q}`);
    setResults(res.data);
    setHighlightedIndex(0);
  }, 300);

  useEffect(() => {
    fetchResults(query);
    return () => fetchResults.cancel();
  }, [query]);

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      setTimeout(() => inputRef.current?.focus(), 50);
      setRecents(getRecent());
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  useEffect(() => {
    // Handle click outside
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [open, onClose]);

  const flatResults = Object.entries(results).flatMap(([type, items]) =>
    items.map(item => ({ ...item, group: type }))
  );

  // Add section results
  const sectionResults = Object.entries(SEARCH_SECTIONS)
    .filter(([key, section]) => 
      section.title.toLowerCase().includes(query.toLowerCase())
    )
    .map(([key, section]) => ({
      id: key,
      name: section.title,
      type: 'section',
      path: section.path,
      icon: section.icon
    }));

  const allResults = [...sectionResults, ...flatResults];

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % allResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + allResults.length) % allResults.length);
    } else if (e.key === 'Enter') {
      if (allResults[highlightedIndex]) handleSelect(allResults[highlightedIndex]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  // Blue highlighting function
  const highlight = (text, indices) => {
    if (!indices?.length) return text;
    const parts = [];
    let last = 0;
    indices.forEach(([start, end], i) => {
      parts.push(text.slice(last, start));
      parts.push(
        <mark key={i} className="bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 font-medium rounded-sm">
          {text.slice(start, end + 1)}
        </mark>
      );
      last = end + 1;
    });
    parts.push(text.slice(last));
    return parts;
  };

  const getRecent = () => JSON.parse(localStorage.getItem(recentKey) || '[]');

  const addRecent = (item) => {
    const updated = [item, ...recents.filter(r => r.id !== item.id || r.type !== item.type)].slice(0, 5);
    setRecents(updated);
    localStorage.setItem(recentKey, JSON.stringify(updated));
  };

  const clearRecents = () => {
    localStorage.removeItem(recentKey);
    setRecents([]);
  };

  const handleSelect = (item) => {
    addRecent(item);
    if (item.type === 'section') {
      navigate(item.path);
    } else {
      switch (item.type) {
        case 'product': navigate(`/products/${item.id}`); break;
        case 'user': navigate(`/users/${item.id}`); break;
        case 'banner': navigate(`/banners/${item.id}`); break;
        case 'category': navigate(`/categories/${item.id}`); break;
        case 'order': navigate(`/orders/${item.id}`); break;
      }
    }
    onClose();
    setQuery('');
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center md:jsutify-end md:pr-8 pt-16 md:pt-28 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose} // Close when tapping outside
        >
          <motion.div
            ref={modalRef}
            className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-lg shadow-lg p-4"
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()} // Prevent click propagation
          >
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base md:text-sm"
              />
              <button 
                className="absolute right-3 top-3 text-gray-500 dark:text-gray-400"
                onClick={onClose}
              >
                ✕
              </button>
            </div>

            {/* Recent searches */}
            {!query && recents.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-sm text-gray-500 dark:text-gray-400">Recent:</h4>
                  <button
                    className="text-xs text-red-500 hover:underline"
                    onClick={clearRecents}
                  >
                    Clear All
                  </button>
                </div>
                <ul className="mt-2 space-y-1">
                  {recents.map((item, i) => (
                    <li
                      key={i}
                      className="cursor-pointer text-blue-600 dark:text-blue-400 hover:underline py-1 text-sm md:text-base"
                      onClick={() => handleSelect(item)}
                    >
                      {item.icon && <span className="mr-2">{item.icon}</span>}
                      [{item.type}] {item.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* No results */}
            {query && allResults.length === 0 && (
              <p className="text-center text-gray-400 dark:text-gray-500 py-4">No results found</p>
            )}

            {/* Search results */}
            {query && (
              <div className="max-h-[60vh] overflow-y-auto space-y-3">
                {/* Sections */}
                {sectionResults.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold capitalize text-gray-600 dark:text-gray-400 mb-1">Sections</h4>
                    <ul>
                      {sectionResults.map((item, i) => {
                        const index = allResults.findIndex(r => r.id === item.id && r.type === item.type);
                        const active = index === highlightedIndex;
                        return (
                          <li
                            key={item.id}
                            className={`p-2 rounded ${active ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'} cursor-pointer text-sm md:text-base`}
                            onClick={() => handleSelect(item)}
                          >
                            <span className="mr-2">{item.icon}</span>
                            {item.name}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {/* Other results */}
                {Object.entries(results).map(([type, items]) => (
                  <div key={type}>
                    <h4 className="text-sm font-semibold capitalize text-gray-600 dark:text-gray-400 mb-1">{type}s</h4>
                    <ul>
                      {items.map((item, i) => {
                        const index = allResults.findIndex(r => r.id === item.id && r.type === item.type);
                        const active = index === highlightedIndex;
                        return (
                          <li
                            key={item.id}
                            className={`p-2 rounded ${active ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'} cursor-pointer text-sm md:text-base`}
                            onClick={() => handleSelect(item)}
                          >
                            {highlight(item.name, item.matchIndices)}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}