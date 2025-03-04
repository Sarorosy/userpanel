import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders"; // Create an Orders page
import Layout from "./layout/Layout";
import './output.css';
import './style.css';
import StoreProfile from "./pages/StoreProfile";
import VendorsMap from "./pages/VendorsMap";
import VendorsPage from "./pages/VendorsPage";
import Home from "./pages/Home"; // Add this import
import AboutUs from "./pages/AboutUs";
import Register from "./pages/Register";
import UserProfile from "./pages/UserProfile";
import ListStrains from "./pages/ListStrains";
import StrainDetails from "./pages/StrainDetails";
import { useState } from "react";
import WriteReviewComponent from "./pages/WriteReviewComponent";
import TermsOfUse from "./pages/TermsOfUse";
import ScrollToTop from "./components/ScrollToTop";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  return user ? children : children;
};



const App = () => {
  
  

  return (
    <AuthProvider>
      <Router >
      <ScrollToTop />
        <Toaster position="top-center" />
        <Routes>
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Register />} />

          {/* Vendor Layout with Protected Routes */}
          <Route
            path="/"
            element={
                <Layout />
            }
          >
            <Route index element={<Home />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="orders" element={<Orders />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="vendors" element={<VendorsPage />} />
            <Route path="map" element={<VendorsMap />} />

            <Route path="about" element={<AboutUs />} />
            <Route path="terms-of-use" element={<TermsOfUse />} />
            <Route path="strains" element={<ListStrains />} />
            <Route path="straindetails/:id/:name" element={<StrainDetails />} />
            <Route path="write-review/:strainId" element={<WriteReviewComponent />} />

          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/signin" />} />
        </Routes>
        
      </Router>
    </AuthProvider>
  );
};

export default App;
