import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header"; // Import the Header component
import Footer from "../components/Footer";
const Layout = () => {
  return (
    <div className="flex  bg-gray-100">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 p-6 h-screen overflow-y-auto">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Layout;
