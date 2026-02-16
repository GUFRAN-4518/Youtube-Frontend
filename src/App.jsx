// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import AppLayout from "./layouts/AppLayout";
// import ProtectedRoute from "./routes/ProtectedRoute";
// import Search from "./pages/Search";
// import Home from "./pages/Home";
// import VideoPage from "./pages/VideoPage";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard";
// import Upload from "./pages/Upload";
// import Channel from "./pages/Channel";
// import Playlist from "./pages/Playlist";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>

//         {/* Public Routes */}
//         <Route
//           path="/login"
//           element={<Login />}
//         />
//         <Route
//           path="/register"
//           element={<Register />}
//         />

//         {/* Layout Routes */}
//         <Route
//           path="/"
//           element={
//             <AppLayout>
//               <Home />
//             </AppLayout>
//           }
//         />

//         <Route
//           path="/video/:id"
//           element={
//             <AppLayout>
//               <VideoPage />
//             </AppLayout>
//           }
//         />

//         <Route
//           path="/channel/:username"
//           element={
//             <AppLayout>
//               <Channel />
//             </AppLayout>
//           }
//         />

//         {/* Protected Routes */}
//         <Route
//           path="/dashboard"
//           element={
//             <ProtectedRoute>
//               <AppLayout>
//                 <Dashboard />
//               </AppLayout>
//             </ProtectedRoute>
//           }
//         />

//         {/* Playlist is protected and uses AppLayout */}
//         <Route
//           path="/playlist/:id"
//           element={
//             <ProtectedRoute>
//               <AppLayout>
//                 <Playlist />
//               </AppLayout>
//             </ProtectedRoute>
//           }
//         />

//         {/* Search is protected but uses AppLayout */}
//         <Route
//           path="/search"
//           element={
//             <AppLayout>
//               <Search />
//             </AppLayout>
//           }
//         />

//         {/* Upload route */}
//         <Route
//           path="/upload"
//           element={
//             <ProtectedRoute>
//               <AppLayout>
//                 <Upload />
//               </AppLayout>
//             </ProtectedRoute>
//           }
//         />



//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import Search from "./pages/Search";
import Home from "./pages/Home";
import VideoPage from "./pages/VideoPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Channel from "./pages/Channel";
import Playlist from "./pages/Playlist";
import Playlists from "./pages/Playlists";  // ✅ NEW


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Layout Routes */}
        <Route
          path="/"
          element={
            <AppLayout>
              <Home />
            </AppLayout>
          }
        />

        <Route
          path="/video/:id"
          element={
            <AppLayout>
              <VideoPage />
            </AppLayout>
          }
        />

        <Route
          path="/channel/:username"
          element={
            <AppLayout>
              <Channel />
            </AppLayout>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* ✅ NEW: Playlists list page */}
        <Route
          path="/playlists"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Playlists />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Single Playlist */}
        <Route
          path="/playlist/:id"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Playlist />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Search */}
        <Route
          path="/search"
          element={
            <AppLayout>
              <Search />
            </AppLayout>
          }
        />

        {/* Upload */}
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Upload />
              </AppLayout>
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;