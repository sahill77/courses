// Debounce function to delay API calls
export const debounce = (func, delay = 500) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Parallel API calls helper
export const parallelRequests = async (requests) => {
  try {
    const results = await Promise.all(requests);
    return results.map(res => res.data);
  } catch (error) {
    console.error('Parallel requests error:', error);
    throw error;
  }
};

// Cache helper for localStorage
export const cacheHelper = {
  set: (key, data, expiryMinutes = 5) => {
    const item = {
      data,
      expiry: Date.now() + expiryMinutes * 60 * 1000,
    };
    localStorage.setItem(key, JSON.stringify(item));
  },
  
  get: (key) => {
    const item = localStorage.getItem(key);
    if (!item) return null;
    
    const parsed = JSON.parse(item);
    if (Date.now() > parsed.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    
    return parsed.data;
  },
  
  remove: (key) => {
    localStorage.removeItem(key);
  },
  
  clear: () => {
    // Clear only cache items (keep auth token)
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('cache_')) {
        localStorage.removeItem(key);
      }
    });
  },
};
