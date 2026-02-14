import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import { useState } from "react";

const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-black text-white min-h-screen">

      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex">

        <Sidebar
          isOpen={sidebarOpen}
          closeSidebar={() => setSidebarOpen(false)}
        />

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
