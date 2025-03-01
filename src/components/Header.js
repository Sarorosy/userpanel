import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Cannabis, ChevronDown, CircleUserRound, LogOut, MapPin, Search, Store, User, X } from "lucide-react";
import ConfirmationModal from "./ConfirmationModal";
import Sidebar from "./Sidebar";
import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";


const Header = () => {
  const { user, logout, setLegalAgeVerified } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState("Select location");
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { setUserLocation } = useAuth();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [showAgeModal, setShowAgeModal] = useState(true);

  const handleAgeConfirm = () => {
    setLegalAgeVerified(true);
    setShowAgeModal(false);
  };

  const handleAgeExit = () => {
    window.location.href = 'https://www.google.com';
  };

  const AgeVerificationModal = ({ isOpen, onConfirm, onExit }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg max-w-sm w-full mx-4">
          <h2 className="text-2xl font-bold mb-4 text-center">To Enter You Must Be At Least 21 Years Old</h2>
          <div className="flex justify-center gap-4">
            <button
              onClick={onExit}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-red-500 hover:text-white"
            >
              Exit
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
            >
              Yes, I'm 21+
            </button>
          </div>
        </div>
      </div>
    );
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(newLocation);
          setError(null);
          fetchLocationName(newLocation.lat, newLocation.lng);

        },
        (err) => {
          setError("Location denied. retry.");
          setLocation(null);
        }
      );
    } else {
      setError("location is not supported.");
    }
  };

  const fetchLocationName = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      if (data && data.address) {
        console.log(data.address)
        const city = data.address.city || data.address.town || data.address.state_district || '';
        const state = data.address.state || '';
        setLocationName(`${city}, ${state}`.trim());
        setUserLocation(`${city}, ${state}`.trim(), lat, lng);
      } else {
        setLocationName("Location not found");
      }
    } catch (error) {
      setLocationName("Error fetching location");
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  const hadleNav = (path) => {
    navigate(path);
  };

  return (
    <>
    <header className="bg-white border-b-2 border-green-700 shadow-md px-4 py-2 flex justify-between items-center">
      {/* Logo Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-green-50 rounded-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-green-700 cursor-pointer" onClick={() => navigate('/')}>GreenMart</h1>
      </div>

      {/* Search Bar Section */}
      <div className="hidden md:flex-1 max-w-2xl mx-8">
        <input
          type="text"
          placeholder="Search stores, strains..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-700"
        />
      </div>
      <div className="md:hidden flex items-center justify-center">
        <button onClick={() => setIsSearchOpen(!isSearchOpen)}>
          <Search />
        </button>
      </div>

      {/* Location and Cart Section */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center">
          <div className="text-right mr-2 flex items-center gap-1">
            <p className="text-sm font-semibold">Delivery to:</p>
            <p className="text-sm text-gray-600">
              {error ? (
                <span className="text-red-500">{error}</span>
              ) : (
                locationName
              )}
            </p>
          </div>
          <button
            onClick={getLocation}
            className="px-3 py-1 text-sm text-green-700 border border-green-700 rounded-lg hover:bg-green-50"
          >
            Change
          </button>
        </div>
        <div className="flex md:hidden">
          <MapPin />
        </div>

        <div className="relative">
          <button className="p-2 hover:bg-green-50 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isSidebarOpen && (
          <Sidebar onClose={() => setIsSidebarOpen(false)} />
        )}
      </AnimatePresence>

    </header>
    <div className="hidden md:flex items-center justify-start bg-white border-b border-gray-100 px-4 shadow-sm">
      <div className="flex space-x-4">
        <button 
          onClick={() => hadleNav("/strains")} 
          className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:text-green-700 hover:bg-green-50 transition-all duration-200 rounded-md"
        >
          <Cannabis size={18} />
          <span className="font-medium">Strains</span>
        </button>
        <button 
          onClick={() => hadleNav("/map")} 
          className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:text-green-700 hover:bg-green-50 transition-all duration-200 rounded-md"
        >
          <Store size={18} />
          <span className="font-medium">Stores Near Me</span>
        </button>
      </div>
    </div>
    {isSearchOpen && (
      <div className=" flex md:hidden items-center justify-center mt-1">
        <input type="text" placeholder="Search stores, strains..." className="w-full mx-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-700" />  
        <button className="p-1 mx-1 bg-red-500 text-white rounded-full" onClick={() => setIsSearchOpen(false)}>
          <X />
        </button>
      </div>
    )}
    { user && !user.legalAgeVerified && (
          <AgeVerificationModal
            isOpen={showAgeModal}
            onConfirm={handleAgeConfirm}
            onExit={handleAgeExit}
          />
        )}
    </>
  );
};

export default Header;
