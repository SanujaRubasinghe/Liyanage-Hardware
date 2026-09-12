import React, { useEffect, useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { socket } from "./socket"
import { ThemeProvider } from './context/ThemeContext';

import OrderDetailsModal from "./OrderDetailsModal";

import AdminLogin from "./components/AdminLogin";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";


import Dashboard from './pages/Dashboard'
import ProductManagement from "./pages/ProductManagement";
import EditProduct from './pages/EditProduct';
import Charts from "./pages/Charts";

import AddProductForm from "./components/AddProductForm";
import OrderManagement from "./pages/OrderManagement";
import OrderList from "./components/OrderList";
import OrderDetail from "./components/OrderDetail";
import OrderMap from './components/OrderMap'
import AnnouncementManager from "./pages/AnnouncementManagement";
import BannerManager from "./pages/BannerManagement";
import PromotionalBannerManager from "./pages/PromotionalBannerManager";
import NewArrivalsManager from "./pages/NewArrivalsManager";
import Settings from "./pages/Settings";
import FeedbackManagement from "./pages/FeedbackManagement";
import CategoryList from "./components/CategoryList";
import CategoryForm from "./components/CategoryForm";
import CategoryAnalytics from "./components/CategoryAnalytics"
import CategoriesDashboard from "./components/CategoriesDashboard"
import BulkOperationsPanel from "./pages/BulkOperationsPanel"
import LoyaltyUsers from "./components/LoyaltyUsers"
import LoyaltyRewards from "./components/LoyaltyRewards"
import LoyaltyDeals from "./components/LoyaltyDeals"
import LoyaltyAnalytics from "./components/LoyaltyAnalytics"
import SmsTemplates from "./components/SmsTemplates";
import UserList from "./components/UserList";

import AddProductFormTest from "./test/AddProductFormTest";

import API from "./api";
import DriverManagement from "./pages/DriverManagement";
import DriverManagementComp from "./components/DriverManagement";
import AdminProfile from "./pages/AdminProfile";

function App() {
  const [admin, setAdmin] = useState(null)

  const [collapsed, setCollapsed] = useState(() => {
    const stored = localStorage.getItem("sidebar-collapsed")
    return stored === "true"
  })

  const [selectedOrder, setSelectedOrder] = useState(null);
  const audioRef = useRef(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await API.get('/admin-auth')
        setAdmin(res.data.admin)
      } catch (error) {
        setAdmin(null)
      }
    }
    checkAuth()
  }, [])

  useEffect(() => {
    audioRef.current = new Audio('/sounds/new-order.mp3');
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.play()
        .catch(error => {
          console.error('Audio playback failed:', error);
          // Handle browser autoplay policies
          if (error.name === 'NotAllowedError') {
            alert('Please interact with the page first to allow audio playback');
          }
        });
    }
  };

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", collapsed)
  }, [collapsed])

  useEffect(() => {
    socket.on('new-order', (order) => {
      playSound()
      toast.success(`New order from ${order.customer} for Rs.${Number(order.total).toFixed(2)}`, {
        icon: "🛒",
        style: { background: "#4ade80", color: "white" },
        onClick: () => setSelectedOrder(order),
        autoClose: 5000,
      })
    })

    return () => {
      socket.off('new-order')
    }
  }, [])

  return (
    <ThemeProvider>
      <Router basename="/admin">
        <ToastContainer position="top-right" autoClose={3000} />
        {!admin ? (
          <Routes>
            <Route path="*" element={<AdminLogin onLogin={setAdmin} />} />
          </Routes>
        ) : (
        <div className="flex flex-col md:flex-row">
          <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
          <main className={`flex-1 bg-gray-100 min-h-screen mt-16 md:mt-0 transition-all duration-300 ml-0 ${collapsed ? 'md:ml-20' : 'md:ml-64'}`}>
            <Header username="Admin" setAdmin={setAdmin} />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/profile" element={<AdminProfile />} />
              <Route path="/products">
                <Route index element={<ProductManagement />} />
                <Route path="edit/:id" element={<EditProduct />} />
                <Route path='new' element={<AddProductForm />} />
                <Route path="bulk" element={<BulkOperationsPanel />} />
              </Route>
              <Route path="/categories">
                <Route path="all" element={<CategoryList />} />
                <Route path="add" element={<CategoryForm />} />
                <Route path="edit/:id" element={<CategoryForm />} />
                <Route path="analytics/:id" element={<CategoryAnalytics />} />
                <Route path="dashboard" element={<CategoriesDashboard />} />
              </Route>
              <Route path="/orders">
                <Route path="dashboard" element={<OrderManagement />} />
                <Route path="list" element={<OrderList />} />
                <Route path=":id" element={<OrderDetail />} />
                <Route path="map" element={<OrderMap />} />
              </Route>
              <Route path="/deliveries">
                <Route path="assign" element={<DriverManagement />} />
                <Route path="drivers" element={<DriverManagementComp/>} />
              </Route>
              <Route path="/cms">
                <Route path="announcements" element={<AnnouncementManager />} />
                <Route path="banners/slider" element={<BannerManager />} />
                <Route path="banners/promotional" element={<PromotionalBannerManager />} />
                <Route path="new-arrivals" element={<NewArrivalsManager />} />
              </Route>
              <Route path="/feedback" element={<FeedbackManagement />} />
              <Route path="/loyalty">
                <Route path="users" element={<LoyaltyUsers />} />
                <Route path="rewards" element={<LoyaltyRewards />} />
                <Route path="deals" element={<LoyaltyDeals />} />
                <Route path="analytics" element={<LoyaltyAnalytics />} />
                <Route path="sms-template" element={<SmsTemplates />} />
              </Route>
              <Route path="/users" element={<UserList />} />
              <Route path="/charts" element={<Charts />} />
              <Route path="/settings" element={<Settings />} />

              {/* <Route path='/test' element={<AddProductFormTest />} /> */}
            </Routes>
            <OrderDetailsModal 
              order={selectedOrder}
              onClose={() => setSelectedOrder(null)}
            />
          </main>
        </div>
        )}
      </Router>
    </ThemeProvider>
  );
}

export default App;
