'use client';
import { useState, useEffect } from "react";

import SearchBarN from "./SearchBarN";
import AnnouncementBar from "./AnnouncementBar";
import Home from "./Home";
import CategorySections from "./CategorySections"
import BrandContainer from "./BrandContainer";
import ConstructionSupplies from "./ConstructionSupplies";
import FeatureSection from "./FeatureSection";
import PromoCards from './PromoCards';
import LoadingScreen from "./LoadingPage";


const HomePage = () => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const alreadyLoaded = sessionStorage.getItem('hasInitialLoadCompleted') === 'true';
    if (alreadyLoaded) {
      setIsLoaded(true);
      return undefined;
    }

    // Simulate loading progress; replace with real data loading if needed
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress >= 100) {
        clearInterval(interval);
        sessionStorage.setItem('hasInitialLoadCompleted', 'true');
        setIsLoaded(true);
      } else {
        setLoadingProgress(progress);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isLoaded]);

  if (!isLoaded) {
    return <LoadingScreen progress={loadingProgress} />;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <SearchBarN />
      <AnnouncementBar />
      <PromoCards />
      <Home />
      <CategorySections />
      <BrandContainer />
      <ConstructionSupplies />
      <FeatureSection />
    </div>
  );
};


export default HomePage;
