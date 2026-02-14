import { Link } from "react-router-dom";

const Sidebar = ({ isOpen, closeSidebar }) => {
  return (
    <>
      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/50 md:hidden"
        />
      )}

      <aside
        className={`
          fixed md:static top-0 left-0 h-full w-64 bg-black border-r border-gray-800 p-4
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <nav className="flex flex-col gap-4">
          <Link to="/" className="hover:bg-gray-800 p-2 rounded">
            Home
          </Link>

          <Link to="/dashboard" className="hover:bg-gray-800 p-2 rounded">
            Dashboard
          </Link>

          <Link to="/upload" className="hover:bg-gray-800 p-2 rounded">
            Upload
          </Link>

          <Link to="/playlists" className="hover:bg-gray-800 p-2 rounded">
            Playlists
          </Link>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
