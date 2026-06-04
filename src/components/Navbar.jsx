import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Menu, Search } from "lucide-react";

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/search?q=${searchQuery.trim()}`);
    setSearchQuery("");
  };

  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/10 transition-all duration-300">
      <div className="flex items-center justify-between px-4 lg:px-8 py-3">

        {/* LEFT SIDE */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="text-gray-300 hover:text-white transition-colors md:hidden"
          >
            <Menu size={28} />
          </button>

          <Link
            to="/"
            className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-600 tracking-tight"
          >
            Clipjoy
          </Link>
        </div>

        {/* CENTER - Search */}
        <form
          onSubmit={handleSearch}
          className="flex md:w-full items-center w-full m-2 max-w-xl group relative"
        >
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-500 group-focus-within:text-red-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all duration-300"
          />
        </form>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-5">
          {user ? (
            <>
              <Link to={`/channel/${user.username}`} className="relative group">
                <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-transparent group-hover:border-red-500 transition-all duration-300">
                  <img
                    src={user.avatar || "https://via.placeholder.com/150"}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>
            </>
          ) : (
            <Link
              to="/login"
              className="text-sm font-semibold text-white border border-white/20 px-5 py-2 rounded-full hover:bg-white hover:text-black transition-all duration-300"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;