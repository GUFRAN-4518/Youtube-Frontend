import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
// 1. Import the MessageSquare icon from lucide-react
import { Home, LayoutDashboard, UploadCloud, ListVideo, LogOut, MessageSquare } from "lucide-react";

const Sidebar = ({ isOpen, closeSidebar }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    closeSidebar();
  };

  // 2. Add Community to your navigation array
  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Upload", path: "/upload", icon: UploadCloud },
    { name: "Playlists", path: "/playlists", icon: ListVideo },
    { name: "Community", path: "/community", icon: MessageSquare }, // 🌟 Added this row
  ];

  return (
    <>
      {isOpen && (
        <div onClick={closeSidebar} className="fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden z-40" />
      )}

      <aside className={`fixed md:sticky top-0 md:top-[65px] left-0 h-screen md:h-[calc(100vh-65px)] w-64 bg-[#0a0a0a] border-r border-white/5 p-4 flex flex-col transform transition-transform duration-300 z-50 ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <nav className="flex flex-col gap-2 mt-4 flex-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={closeSidebar}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${isActive ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-gray-200"}`}
              >
                <Icon size={20} className={isActive ? "text-red-500" : ""} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {user && (
          <div className="pt-4 border-t border-white/5 mb-6">
            <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200">
              <LogOut size={20} />
              Logout
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;