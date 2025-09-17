import API from "../api";

export const useSearchTracker = () => {
  const trackSearch = async (query, resultsCount) => {
    try {
      await API.post('/analytics/user/search-query', {
        query,
        results_count: resultsCount
      });
    } catch (error) {
      console.error('Search tracking failed:', error);
    }
  };

  return { trackSearch };
};