import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    navigate(`/search?q=${searchQuery.trim()}`);
    setSearchQuery("");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="bg-black border-b border-gray-800 sticky top-0 z-50">

      <div className="flex items-center justify-between px-6 py-3">

        {/* Left Section - Logo */}
        <Link to="/" className="text-2xl font-bold text-red-600">
          MyTube
        </Link>

        {/* Center Section - Search */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center w-1/2"
        >
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-l-full focus:outline-none"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-gray-800 border border-gray-700 rounded-r-full hover:bg-gray-700"
          >
            🔍
          </button>
        </form>

        {/* Right Section */}
        <div className="flex items-center gap-4">

          {user ? (
            <>
              <Link
                to="/upload"
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold"
              >
                Upload
              </Link>

              <Link
                to="/dashboard"
                className="hidden md:block text-gray-300 hover:text-white"
              >
                Dashboard
              </Link>

              {/* Avatar */}
              <Link to={`/channel/${user._id}`}>
                <div className="w-8 h-8 bg-gray-700 rounded-full overflow-hidden">
                  {user.avatar && (
                    <img
                      src={user.avatar}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </Link>

              <button
                onClick={handleLogout}
                className="text-sm text-gray-400 hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="border border-gray-600 px-4 py-2 rounded-lg hover:bg-gray-800"
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