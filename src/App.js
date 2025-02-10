import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Components/Home';
import JobSeekers from './Components/JobSeekers';
import AboutUs from './Components/AboutUs';
import ContactUs from './Components/ContactUs';
import Testh from './Components/Testh';
import Slideshow from './Components/Slideshow';



function App() {
  return (
    <div>

    <Router>
      <Navbar />
      
      <Slideshow />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/job-seekers" element={<JobSeekers />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/Testh" element={<Testh />} />
      </Routes>
    </Router>

    </div>
  );
}

export default App;
