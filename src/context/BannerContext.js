import React, { createContext, useContext, useEffect, useState } from 'react';
import API from "../api"

const BannerContext = createContext();

export const useBanners = () => useContext(BannerContext);

export const BannerProvider = ({ children }) => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('admin/banners')
      .then(res => setBanners(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <BannerContext.Provider value={{ banners, loading }}>
      {children}
    </BannerContext.Provider>
  );
};
