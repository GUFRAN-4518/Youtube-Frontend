import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { 
  Home, 
  LayoutDashboard, 
  UploadCloud, 
  ListVideo, 
  LogOut, 
  MessageSquare, 
  Linkedin, 
  Github, 
  User 
} from "lucide-react";

const Sidebar = ({ isOpen, closeSidebar }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    closeSidebar();
  };

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Upload", path: "/upload", icon: UploadCloud },
    { name: "Playlists", path: "/playlists", icon: ListVideo },
    { name: "Community", path: "/community", icon: MessageSquare },
  ];

  return (
    <>
      {isOpen && (
        <div onClick={closeSidebar} className="fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden z-40" />
      )}

      <aside className={`fixed md:sticky top-0 md:top-[65px] left-0 h-screen md:h-[calc(100vh-65px)] w-64 bg-[#0a0a0a] border-r border-white/5 p-4 flex flex-col transform transition-transform duration-300 z-50 ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        {/* Navigation Section */}
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

        <div className="pt-4 border-t border-white/5 mb-2 px-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            <User size={12} />
            <span>About Me</span>
          </div>
          <div className="flex gap-3">
            <a 
              href="https://www.linkedin.com/in/gufran-ansari-7279ba303/" 
              target="_blank" 
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-blue-600/10 hover:text-blue-400 border border-white/10 text-gray-400 rounded-xl text-xs font-medium transition-all"
            >
              <Linkedin size={14} />
              LinkedIn
            </a>
            <a 
              href="https://github.com/GUFRAN-4518"
              target="_blank" 
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-white/10 hover:text-white border border-white/10 text-gray-400 rounded-xl text-xs font-medium transition-all"
            >
              <Github size={14} />
              GitHub
            </a>
          </div>
        </div>

        {/* Logout Core Action Row */}
        {user && (
          <div className="pt-2 border-t border-white/5 mb-6">
            <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-2.5 rounded-xl font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 text-sm">
              <LogOut size={18} />
              Logout
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;