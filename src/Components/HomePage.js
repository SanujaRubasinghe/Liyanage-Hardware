import { useState, useEffect } from "react";

import Header from "./Header";
import SearchBarN from "./SearchBarN";
import AnnouncementBar from "./AnnouncementBar";
import BannerSlider from "./BannerSlider";
import ImageDeliver from "./ImageDeliver"
import Home from "./Home";
import NewArrivals from "./NewArrivals"
import AllProductD from "./AllProductD"
import AllProductsA from "./AllProductsA";
import BrandContainer from "./BrandContainer";
import ConstructionSupplies from "./ConstructionSupplies";
import FeatureSection from "./FeatureSection";
import PromoCards from './PromoCards';
import Footer from "./Footer";
import LoadingScreen from "./LoadingPage";

import { Helmet } from "react-helmet";

const HomePage = () => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading progress; replace with real data loading if needed
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress >= 100) {
        clearInterval(interval);
        setIsLoaded(true);
      } else {
        setLoadingProgress(progress);
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  if (!isLoaded) {
    return <LoadingScreen progress={loadingProgress} />;
  }

  return (
    <>
      <Helmet>
        <title>New Liyanage Hardware | Quality Tools & Hardware in Sri Lanka</title>
        <meta name="description" content="Discover top-quality hardware tools and building materials from New Liyanage Hardware. Serving Sri Lanka with trusted products and service." />
        <link rel="canonical" href="https://newliyanagehardwarelk/" />
        <meta property="og:title" content="New Liyanage Hardware" />
        <meta property="og:description" content="Discover top-quality hardware tools and materials." />
        <meta property="og:url" content="https://newliyanagehardware.lk/" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <Header />
      <SearchBarN />
      <AnnouncementBar />
      <BannerSlider
        onLoad={() => setIsLoaded(true)}
      />
      <div style={{marginBottom: '40px'}}>
        <ImageDeliver />
      </div>
      <PromoCards />
      <Home />
      <NewArrivals />
      <AllProductD />
      <br />
      <AllProductsA />
      <BrandContainer />
      <ConstructionSupplies />
      <FeatureSection />
      <Footer />
    </>
  );
};

export default HomePage;
