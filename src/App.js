import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CartProvider } from './Components/CartContext';  // Import CartProvider
import Navbar from './Navbar';
import Home from './Components/Home';
import JobSeekers from './Components/JobSeekers';
import AboutUs from './Components/AboutUs';
import ContactUs from './Components/ContactUs';
import ImageDeliver from './Components/ImageDeliver';
import BrandContainer from './Components/BrandContainer';
import Header from './Components/Header';
import Slideshow from './Components/Slideshow';
import SearchBar from './Components/SearchBar';
import ProductList from './Components/ProductList';
import Footer from './Components/Footer';
import ConstructionSupplies from './Components/ConstructionSupplies';
import CategorySection from './Components/CategorySection';
import Subcategories from './Components/SubCategories';
import ProductDisplay from './Components/ProductDisplay';
import FeatureSection from './Components/FeatureSection';
import NewArrivals from './Components/NewArrivals';
import SearchBarNew from './Components/SearchBarNew';
import ShoppingCart from './Components/ShoppingCart';
import BuyingPage from './Components/BuyingPage';
import MiniCategory from './Components/MiniCategory';
import LogInPage from './Components/LogInPage';

function App() {
  return (
    <div>
      <Router>
        {/* Wrap the entire app inside CartProvider */}
        <CartProvider>
          <Navbar />

          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Header />
                  <Slideshow />
                  <ImageDeliver />
                  <SearchBar />
                  <SearchBarNew />
                  <Home />
                  <ProductList />
                  <BrandContainer />
                  <ConstructionSupplies />
                  <NewArrivals />
                  <FeatureSection />
                  <Footer />
                </>
              }
            />
            <Route
              path="/products"
              element={
                <>
                  <ProductList />
                  <FeatureSection />
                  <Footer />
                </>
              }
            />
            <Route
              path="/about-us"
              element={
                <>
                  <AboutUs />
                  <BuyingPage />
                  <Footer />
                </>
              }
            />
            <Route
              path="/contact-us"
              element={
                <>
                  <ContactUs />
                  <MiniCategory />
                  <Footer />
                </>
              }
            />
            <Route
              path="/category"
              element={
                <>
                  <CategorySection />
                  <Footer />
                </>
              }
            />
            <Route path="/product-display" element={<ProductDisplay />} />
            <Route path="/cart" element={<ShoppingCart />} />
            <Route path="/buying" element={<BuyingPage />} />
            <Route path="/sub-category" element={<Subcategories />} />
            <Route path='/login' element={<LogInPage/>} />
          </Routes>
        </CartProvider>
      </Router>
    </div>
  );
}

export default App;
