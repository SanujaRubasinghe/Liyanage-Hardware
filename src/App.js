import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { CartProvider } from './Components/CartContext';
import Navbar from './Navbar';
import Home from './Components/Home';
import JobSeekers from './Components/JobSeekers';
import AboutUs from './Components/AboutUs';
import ContactUs from './Components/ContactUs';
import ImageDeliver from './Components/ImageDeliver';
import BrandContainer from './Components/BrandContainer';
import Header from './Components/Header';
import Slideshow from './Components/Slideshow';

import ProductList from './Components/ProductList';
import Footer from './Components/Footer';
import ConstructionSupplies from './Components/ConstructionSupplies';
import CategorySection from './Components/CategorySection';
import Subcategories from './Components/SubCategories';
import ProductDisplay from './Components/ProductDisplay';
import FeatureSection from './Components/FeatureSection';
import NewArrivals from './Components/NewArrivals';

import ShoppingCart from './Components/ShoppingCart';
import BuyingPage from './Components/BuyingPage';
import MiniCategory from './Components/MiniCategory';
import AdminPanel from './Components/AdminPage/AdminPanel';
import SubCategoryTable from './Components/AdminPage/SubCategoryTable';
import AdminLayout from './Components/AdminPage/AdminLayout';
import CustomerComplaintsForm from './Components/CustomerComplaintsForm';
import SearchBarN from './Components/SearchBarN';
import Feedback from './Components/Feedback';
import PrivateRoute from './Components/PrivateRoutes';
import UserProfile from './Components/UserProfile';
import LogInPage from './Components/LogInPage';
import Searchbarr from './Components/searchbarr';
import AboutUsNew from './Components/AboutUsNew';
import AnnouncementBar from './Components/AnnouncementBar';
import BannerSlider from './Components/BannerSlider';

import socket from './context/socketContext'
import { v4 as uuidv4 } from 'uuid';
import API from './api';
import ProductPageN from './Components/ProductPageN';
import AllProductD from './Components/AllProductD';
import AllProductsA from './Components/AllProductsA';
import URegForm from './Components/u_reg_form';  
import TermsAndConditions from './Components/TermsAndConditions';
import ReturnPolicy from './Components/ReturnPolicy';
import ShippingPolicy from './Components/ShippingPolicy';
import Disclaimer from './Components/Disclaimer';
import ContactUsA from './Components/ContactUsA';

import Policy from './Policy';
import FloatingSearchBar from './Components/FloatingSearchBar';
import OrderConfirmation from './Components/OrderConfirmation';
import MainCategoies from './Components/MainCategories';

import { useActivityTracker } from './hooks/useActivityTracker';


function App() {
  useActivityTracker()
  // useEffect(() => {
  //   if (!sessionStorage.getItem('session_id')) {
  //     sessionStorage.setItem('session_id', uuidv4());
  //   }
  // }, []);
  
  return (
    <div>
      <Router>
        <ToastContainer position="top-right" autoClose={3000} />
        <CartProvider>
          <Navbar />
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Header />
                  <SearchBarN />
                  <AnnouncementBar />
                  <BannerSlider />
                  <ImageDeliver />
                  <Home />
                  <NewArrivals />
                  <AllProductD/>
                  <br></br>
                  <AllProductsA/>
                  {/* <ProductList /> */}
                  <BrandContainer />
                  <ConstructionSupplies />
               
                  {/* <FloatingSearchBar/> */}
                  <FeatureSection />
                  <Footer />
                </>
              }
            />
            {/*<Route path="/products" element={<><ProductList /><FeatureSection /><Footer /></>} />*/}
            <Route path="/products" element={<><ProductPageN/><FeatureSection /><Footer /></>} />
            <Route path="/products/:id" element={<ProductDisplay />} />
            <Route path="/complaint" element={<><CustomerComplaintsForm /><Footer /></>} />
            <Route path="/categories" element={<><MainCategoies/><Footer /></>} />
            <Route path="/categories/:id" element={<Subcategories />} />
            <Route path="/categories/:subcat/:id" element={<MiniCategory />} />
            <Route path="/category/:catid/products" element={<><ProductPageN/><FeatureSection /><Footer /></>} />
            <Route path="/about-us" element={<><AboutUsNew /><FeatureSection /><Footer /></>} />
            <Route path="/contact-us" element={<><ContactUs /><MiniCategory /><Footer /></>} />
            <Route path="/Policy" element={<><Policy /><Footer /></>} />


            <Route path="/feedback" element={<><Feedback /><Footer /></>} />
            {/* <Route path="/category" element={<PrivateRoute element={<><Feedback /><Footer /></>} />} /> */}
            {/* <Route path="/product-display" element={<ProductDisplay />} /> */}
            <Route path="/cart" element={<ShoppingCart />} />
            <Route path="/buying" element={<BuyingPage />} />
            <Route path="/order-confirmation" element={<OrderConfirmation/> } />
            {/* <Route path="/sub-category" element={<Subcategories />} /> */}
            <Route path="/searchbarr" element={<Searchbarr />} />
            <Route path='/register' element={<><URegForm /><Footer /></>} />
            <Route path="/TermsAndConditions" element={<TermsAndConditions />} />
            <Route path="/ReturnPolicy" element={<ReturnPolicy />} />
            <Route path="/ShippingPolicy" element={<ShippingPolicy />} />
            <Route path="/Disclaimer" element={<><Disclaimer /><Footer /></>} />
            <Route path="/ContactUsA" element={<ContactUsA />} />

            <Route path="/about-us" element={<><AboutUsNew /><FeatureSection /><Footer /></>} />

            
            <Route path='/login' element={<LogInPage />}/>
            <Route path="/profile" element={<PrivateRoute element={<UserProfile />} />} />
            
            {/* Public Route for MiniCategory */}
            <Route path="/mini-category/:subcategory" element={<MiniCategory />} />
          </Routes>
        </CartProvider>
      </Router>
    </div>
  );
}

export default App;
