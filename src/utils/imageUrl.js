export const getImageUrl = (path) => {
  if (!path) return '/images/Sample.jpg';
  if (typeof path !== 'string') return '/images/Sample.jpg';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
  
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // Handle static local assets under /images/
  if (cleanPath.startsWith('/images/')) {
    return cleanPath;
  }

  return `${baseUrl.replace(/\/$/, '')}${cleanPath}`;
};
