import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { CartProvider } from "./Components/CartContext";
import Navbar from "./Navbar";

import Footer from "./Components/Footer";
import Subcategories from "./Components/SubCategories";
import ProductDisplay from "./Components/ProductDisplay";
import FeatureSection from "./Components/FeatureSection";

import ShoppingCart from "./Components/ShoppingCart";
import BuyingPage from "./Components/BuyingPage";
import MiniCategory from "./Components/MiniCategory";
import CustomerComplaintsForm from "./Components/CustomerComplaintsForm";
import Feedback from "./Components/Feedback";
import PrivateRoute from "./Components/PrivateRoutes";
import UserProfile from "./Components/UserProfile";
import LogInPage from "./Components/LogInPage";
import Searchbarr from "./Components/searchbarr";
import AboutUsNew from "./Components/AboutUsNew";

import ProductPageN from "./Components/ProductPageN";
import TermsAndConditions from "./Components/TermsAndConditions";
import ReturnPolicy from "./Components/ReturnPolicy";
import ShippingPolicy from "./Components/ShippingPolicy";
import Disclaimer from "./Components/Disclaimer";
import ContactUsA from "./Components/ContactUsA";

import Policy from "./Policy";
import OrderConfirmation from "./Components/OrderConfirmation";
import MainCategoies from "./Components/MainCategories";
import { useActivityTracker } from "./hooks/useActivityTracker";
import HomePage from "./Components/HomePage";
import PasswordResetForm from "./Components/PasswordResetForm";
import PasswordReset from "./Components/PasswordReset";
import ScrollToTop from "./Components/ScrollToTop";
import ScrollRestorationFix from "./Components/ScrollRestorationFix";

function App() {
  useActivityTracker();
  return (
    <div>
      <Router>
        <ToastContainer position="top-right" autoClose={3000} />
        <CartProvider>
          <Navbar />
          <ScrollRestorationFix />
          <ScrollToTop />
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <HomePage />
                </>
              }
            />
            {/*<Route path="/products" element={<><ProductList /><FeatureSection /><Footer /></>} />*/}
            <Route
              path="/products"
              element={
                <>
                  <ProductPageN />
                  <FeatureSection />
                  <Footer />
                </>
              }
            />
            <Route path="/products/:id" element={<ProductDisplay />} />
            <Route
              path="/complaint"
              element={
                <>
                  <CustomerComplaintsForm />
                  <Footer />
                </>
              }
            />
            <Route
              path="/categories"
              element={
                <>
                  <MainCategoies />
                  <Footer />
                </>
              }
            />
            <Route path="/categories/:id" element={<Subcategories />} />
            <Route path="/categories/:subcat/:id" element={<MiniCategory />} />
            <Route
              path="/category/:catid/products"
              element={
                <>
                  <ProductPageN />
                  <FeatureSection />
                  <Footer />
                </>
              }
            />
            <Route
              path="/about-us"
              element={
                <>
                  <AboutUsNew />
                  <FeatureSection />
                  <Footer />
                </>
              }
            />
            <Route
              path="/contact-us"
              element={
                <>
                  <ContactUsA />
                  <Footer />
                </>
              }
            />
            <Route
              path="/policy"
              element={
                <>
                  <Policy />
                  <Footer />
                </>
              }
            />

            <Route
              path="/feedback"
              element={
                <>
                  <Feedback />
                  <Footer />
                </>
              }
            />
            {/* <Route path="/category" element={<PrivateRoute element={<><Feedback /><Footer /></>} />} /> */}
            {/* <Route path="/product-display" element={<ProductDisplay />} /> */}
            <Route path="/cart" element={<ShoppingCart />} />
            <Route path="/buying" element={<BuyingPage />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            {/* <Route path="/sub-category" element={<Subcategories />} /> */}
            <Route path="/searchbarr" element={<Searchbarr />} />
            {/* <Route path='/register' element={<><URegForm /><Footer /></>} /> */}
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/return-policy" element={<ReturnPolicy />} />
            <Route path="/shipping-policy" element={<ShippingPolicy />} />
            <Route
              path="/disclaimer"
              element={
                <>
                  <Disclaimer />
                  <Footer />
                </>
              }
            />

            <Route path="/login" element={<LogInPage />} />
            <Route
              path="/profile"
              element={<PrivateRoute element={<UserProfile />} />}
            />
            <Route
              path="/reset-password-link"
              element={<PasswordResetForm />}
            />
            <Route path="/reset-password" element={<PasswordReset />} />

          </Routes>
        </CartProvider>
      </Router>
    </div>
  );
}

export default App;
