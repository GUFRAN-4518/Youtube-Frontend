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

      <Navbar toggleSidebar={() => setIsOpen(true)} />

      <div className="flex">

        {/* Sidebar (handles mobile + desktop internally) */}
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
