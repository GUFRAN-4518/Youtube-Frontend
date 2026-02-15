// import Navbar from "../components/Navbar.jsx";
// import Sidebar from "../components/Sidebar.jsx";
// import { useState } from "react";

// const AppLayout = ({ children }) => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <div className="bg-black text-white min-h-screen">

//       <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

//       <div className="flex">

//         <Sidebar
//           isOpen={sidebarOpen}
//           closeSidebar={() => setSidebarOpen(false)}
//         />

//         <main className="flex-1 p-6">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AppLayout;

import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const AppLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Navbar */}
      <Navbar toggleSidebar={() => setIsOpen(true)} />

      <div className="flex">

        {/* Sidebar Desktop */}
        <div className="hidden md:block w-64">
          <Sidebar />
        </div>

        {/* Sidebar Mobile */}
        {isOpen && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Slide Sidebar */}
            <div className="fixed top-0 left-0 h-full w-64 bg-gray-900 z-50 md:hidden transition-transform">
              <Sidebar closeSidebar={() => setIsOpen(false)} />
            </div>
          </>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>

      </div>
    </div>
  );
};

export default AppLayout;
