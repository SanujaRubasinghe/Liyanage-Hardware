import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
import Searchbarr from './Components/Searchbarr';
import AboutUsNew from './Components/AboutUsNew';
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
import PromoCards from './Components/PromoCards';


function App() {
  return (
    <div>
      <Router>
        <CartProvider>
          <Navbar />
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Header />
                  <SearchBarN />
                  <Slideshow />
                  <ImageDeliver />
                  <Home />
                  <NewArrivals />
                  <AllProductD/>
                  <br></br>
                  <AllProductsA/>
                  {/* <ProductList /> */}
                  <BrandContainer />
                  <PromoCards/>
                  <ConstructionSupplies />
               
                  <FloatingSearchBar/>
                  <FeatureSection />
                  <Footer />
                </>
              }
            />
            {/*<Route path="/products" element={<><ProductList /><FeatureSection /><Footer /></>} />*/}
            <Route path="/products" element={<><ProductPageN/><FeatureSection /><Footer /></>} />
            <Route path="/about-us" element={<><AboutUs /><CustomerComplaintsForm /><Footer /></>} />
            <Route path="/contact-us" element={<><ContactUs /><MiniCategory /><Footer /></>} />
            <Route path="/Policy" element={<><Policy /><Footer /></>} />


             <Route path="/feedback" element={<><Feedback /><Footer /></>} />
            <Route path="/category" element={<PrivateRoute element={<><Feedback /><Footer /></>} />} />
            <Route path="/product-display" element={<ProductDisplay />} />
            <Route path="/cart" element={<ShoppingCart />} />
            <Route path="/buying" element={<BuyingPage />} />
            <Route path="/sub-category" element={<Subcategories />} />
            <Route path="/searchbarr" element={<Searchbarr />} />
            <Route path='/register' element={<><URegForm /><Footer /></>} />
            <Route path="/TermsAndConditions" element={<TermsAndConditions />} />
            <Route path="/ReturnPolicy" element={<ReturnPolicy />} />
            <Route path="/ShippingPolicy" element={<ShippingPolicy />} />
            <Route path="/Disclaimer" element={<><Disclaimer /><Footer /></>} />
            <Route path="/ContactUsA" element={<ContactUsA />} />

            <Route path="/services" element={<><AboutUsNew /><FeatureSection /><Footer /></>} />

            
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
