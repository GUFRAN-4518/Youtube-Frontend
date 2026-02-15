import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const { user, logout } = useContext(AuthContext);
const navigate = useNavigate();

const handleLogout = async () => {
  await logout();
  navigate("/login");
};
const Sidebar = ({ isOpen, closeSidebar }) => {

  return (
    <>
      {/* Overlay (Mobile only) */}
      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/50 md:hidden z-40"
        />
      )}

      <aside
        className={`
          fixed md:static top-0 left-0 h-full w-64 bg-black border-r border-gray-800 p-4
          transform transition-transform duration-300 z-50
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <nav className="flex flex-col gap-4 mt-6">

          <Link
            to="/"
            onClick={closeSidebar}
            className="hover:bg-gray-800 p-2 rounded"
          >
            Home
          </Link>

          <Link
            to="/dashboard"
            onClick={closeSidebar}
            className="hover:bg-gray-800 p-2 rounded"
          >
            Dashboard
          </Link>

          <Link
            to="/upload"
            onClick={closeSidebar}
            className="hover:bg-gray-800 p-2 rounded"
          >
            Upload
          </Link>

          <Link
            to="/playlist"
            onClick={closeSidebar}
            className="hover:bg-gray-800 p-2 rounded"
          >
            Playlists
          </Link>

          {user && (
            <button
              onClick={handleLogout}
              className="mt-6 text-red-500 hover:text-red-400 p-2 text-left"
            >
              Logout
            </button>
          )}

        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
