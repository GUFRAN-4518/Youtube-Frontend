import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const AppLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">

      <Navbar toggleSidebar={() => setIsOpen(true)} />

      <div className="flex">

        {/* Sidebar */}
        <Sidebar
          isOpen={isOpen}
          closeSidebar={() => setIsOpen(false)}
        />

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>

      </div>
    </div>
  );
};

export default AppLayout;
