import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Components/Home';
import JobSeekers from './Components/JobSeekers';
import AboutUs from './Components/AboutUs';
import ContactUs from './Components/ContactUs';
import Testh from './Components/Testh'; // Ensure the case matches
import ImageDeliver from './Components/ImageDeliver';

import Header from './Components/Header';

import Slideshow from './Components/Slideshow';
import SearchBar from './Components/SearchBar';
import Product from './Components/Product';
import ProductList from './Components/ProductList';
import Footer from './Components/Footer';



function App() {
  return (
    <div>

    <Router>
      <Navbar />
      
      <Header />
      <Slideshow />
      <ImageDeliver/>
      <SearchBar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/job-seekers" element={<JobSeekers />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/Testh" element={<Testh />} />
      </Routes>
      <ProductList/>

      <Footer/>
    </Router>


    </div>
  );
}

export default App;
