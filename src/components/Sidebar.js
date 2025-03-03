import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, Package, ChevronLeft, ChevronRight, LogOut, Store, BadgeCheck, Map, Bell, Users, X, ChevronDown, Info, HelpCircle, LogIn, Cannabis, Smartphone, User } from "lucide-react";
import cannabislogo from "../assets/weedlogo.svg";
import { useAuth } from "../context/AuthContext";
import ConfirmationModal from "./ConfirmationModal";
import { AnimatePresence } from "framer-motion";
import NotificationDiv from "./NotificationDiv";
import { motion } from "framer-motion";
import LogoutModal from "./LogoutModal";
const Sidebar = ({ onClose }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notificationsDivOpen, setNotificationDivOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);


  const handleLogout = async () => {
    await logout();
    navigate("/signin");
  };

  const hadleNav = (path) => {
    onClose();
    navigate(path);
    
  };

  return (
    <motion.div 
    initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={{zIndex:999999999}}
      className="fixed bg-[#1E3A1E] text-white top-0  left-0 h-full w-full sm:w-1/4 lg:w-1/5 shadow-2xl z-50 overflow-y-auto px-3 py-3  rounded-r-2xl"
    >

      <div className={`${isExpanded ? "justify-between" : "justify-center"} flex items-center p-3`}>
        
      <h1 className="text-2xl font-bold text-white">GreenMart</h1>
        
        <button onClick={onClose} className="p-1 bg-red-500 hover:bg-red-600 rounded-full transition-transform hover:scale-110">
          <X size={18} />
        </button>
      </div>

      {/* Sidebar Links */}
      <ul className="space-y-2 flex-1 overflow-x-hidden">
        {(user && user.email && user.email != null) ? (
          <li className="w-full hover:bg-green-900 rounded-lg">
            <button onClick={() => hadleNav("/profile")} className={`${isExpanded ? "pl-2" : "justify-center"} flex items-center gap-3 text-sm p-2   transition-all duration-200 hover:pl-5`}>
              <User size={18} /> {isExpanded && "Hi, " + (user.preferred_name != null ? user.preferred_name : user.email)}
            </button>
          </li>
        ) : (
          <>
        <li className="w-full hover:bg-green-900 rounded-lg">
          <button onClick={() => hadleNav("/signin")} className={`${isExpanded ? "pl-2" : "justify-center"} flex items-center gap-3 text-sm p-2   transition-all duration-200 hover:pl-5`}>
            <LogIn size={18} /> {isExpanded && "Sign In"}
          </button>
        </li>
        <li className="w-full hover:bg-green-900 rounded-lg">
          <button onClick={() => hadleNav("/signup")} className={`${isExpanded ? "pl-2" : "justify-center"} flex items-center gap-3 text-sm p-2   transition-all duration-200 hover:pl-5`}>
            <BadgeCheck size={18} /> {isExpanded && "Create Account"}
          </button>
        </li>
        </>
        )}
        <li className="w-full hover:bg-green-900 rounded-lg">
          <button onClick={() => hadleNav("/strains")} className={`${isExpanded ? "pl-2" : "justify-center"} flex items-center gap-3 text-sm p-2   transition-all duration-200 hover:pl-5`}>
            <Cannabis size={18} /> {isExpanded && "Strains"}
          </button>
        </li>
        <li className="w-full hover:bg-green-900 rounded-lg">
          <button onClick={() => hadleNav("/map")} className={`${isExpanded ? "pl-2" : "justify-center"} flex items-center gap-3 text-sm p-2   transition-all duration-200 hover:pl-5`}>
            <Store size={18} /> {isExpanded && "Stores Near Me"}
          </button>
        </li>
        <li className="w-full hover:bg-green-900 rounded-lg">
          <button onClick={() => hadleNav("/")} className={`${isExpanded ? "pl-2" : "justify-center"} flex items-center gap-3 text-sm p-2   transition-all duration-200 hover:pl-5`}>
            <Smartphone size={18} /> {isExpanded && "Download App"}
          </button>
        </li>
        <li className="w-full hover:bg-green-900 rounded-lg">
          <button onClick={() => hadleNav("/about")} className={`${isExpanded ? "pl-2" : "justify-center"} flex items-center gap-3 text-sm p-2   transition-all duration-200 hover:pl-5`}>
            <Info size={18} /> {isExpanded && "About Us"}
          </button>
        </li>
        <li className="w-full hover:bg-green-900 rounded-lg">
          <button onClick={() => hadleNav("/help")} className={`${isExpanded ? "pl-2" : "justify-center"} flex items-center gap-3 text-sm p-2   transition-all duration-200 hover:pl-5`}>
            <HelpCircle size={18} /> {isExpanded && "Help"}
          </button>
        </li>
      </ul>





      <LogoutModal
        isOpen={isModalOpen}
        message="Are you sure you want to log out?"
        smallMessage="You will be redirected to the login page."
        onConfirm={handleLogout}
        onCancel={() => setIsModalOpen(false)}
      />

      {(user && user.email && user.email != null) && (
      <div className="p-3">
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-3 text-sm w-full p-2 rounded-lg bg-red-600 hover:bg-red-700 transition-all hover:pl-5">
          <LogOut size={18} /> {isExpanded && "Logout"}
        </button>
      </div>
      )}

      <AnimatePresence>
        {notificationsDivOpen && (
          <NotificationDiv onClose={() => { setNotificationDivOpen(false) }} />
        )}

      </AnimatePresence>
    </motion.div>
  );
};

export default Sidebar;
