import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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

function App() {
  return (
    <div>
      <Router>
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
                <Home />
                <ProductList />
                <BrandContainer />
                <ConstructionSupplies />
                
                <Footer />
              </>
            }
          />

         
          <Route
            path="/products"
            element={
              <>
              <ProductList />
                <JobSeekers />
                <Footer />
              </>
            }
          />

       
          <Route
            path="/about-us"
            element={
              <>
                <AboutUs />
                <Footer />
              </>
            }
          />

       
          <Route
            path="/contact-us"
            element={
              <>
                <Subcategories/>
                <ContactUs />
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
        </Routes>
      </Router>
    </div>
  );
}

export default App;
