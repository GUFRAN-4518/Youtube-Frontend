// import { useEffect, useState } from "react";
// import { getAllVideos } from "../api/videoApi";
// import VideoCard from "../components/VideoCard";
// import SkeletonCard from "../components/SkeletonCard";

// const Home = () => {
//   const [videos, setVideos] = useState([]);
//   const [page, setPage] = useState(1);
//   const [limit] = useState(8);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [hasMore, setHasMore] = useState(true);

//   const fetchVideos = async (currentPage) => {
//     try {
//       setLoading(true);
//       setError("");

//       const res = await getAllVideos({
//         page: currentPage,
//         limit,
//         sortBy: "createdAt",
//         sortType: "desc",
//       });

//       const newVideos = res.data.data;

//       if (newVideos.length < limit) {
//         setHasMore(false);
//       }

//       setVideos((prev) =>
//         currentPage === 1 ? newVideos : [...prev, ...newVideos]
//       );

//     } catch (err) {
//       setError(
//         err.response?.data?.message || "Failed to fetch videos"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchVideos(page);
//   }, [page]);

//   return (
//     <div>

//       {/* Error State */}
//       {error && (
//         <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4">
//           {error}
//         </div>
//       )}

//       {/* Empty State */}
//       {!loading && videos.length === 0 && (
//         <div className="text-gray-400 text-center mt-20">
//           No videos found.
//         </div>
//       )}

//       {/* Video Grid */}
//       <div className="
//         grid 
//         grid-cols-1 
//         sm:grid-cols-2 
//         md:grid-cols-3 
//         lg:grid-cols-4 
//         gap-6
//       ">
//         {videos.map((video) => (
//           <VideoCard key={video._id} video={video} />
//         ))}
//       </div>

//       {/* Load More Button */}
//       {hasMore && !loading && videos.length > 0 && (
//         <div className="flex justify-center mt-8">
//           <button
//             onClick={() => setPage((prev) => prev + 1)}
//             className="bg-gray-800 hover:bg-gray-700 px-6 py-2 rounded-lg"
//           >
//             Load More
//           </button>
//         </div>
//       )}

//       {/* Loading State */}
//       {loading && (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {Array(8).fill().map((_, i) => (
//             <SkeletonCard key={i} />
//           ))}
//         </div>
//       )}


//     </div>
//   );
// };

// export default Home;

import { useEffect, useState, useContext } from "react";
import { getAllVideos } from "../api/videoApi";
import VideoCard from "../components/VideoCard";
import SkeletonCard from "../components/SkeletonCard";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const { user } = useContext(AuthContext);   // ✅ get user

  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(8);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);

  const fetchVideos = async (currentPage) => {
    try {
      setLoading(true);
      setError("");

      const res = await getAllVideos({
        page: currentPage,
        limit,
        sortBy: "createdAt",
        sortType: "desc",
      });

      const newVideos = res.data.data;

      if (newVideos.length < limit) {
        setHasMore(false);
      }

      setVideos((prev) =>
        currentPage === 1 ? newVideos : [...prev, ...newVideos]
      );

    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch videos"
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Only fetch if user exists
  useEffect(() => {
    if (user) {
      fetchVideos(page);
    }
  }, [page, user]);

  // ✅ If not logged in
  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Please Login or Register
          </h2>
          <p className="text-gray-400">
            You need to be logged in to view videos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>

      {error && (
        <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {!loading && videos.length === 0 && (
        <div className="text-gray-400 text-center mt-20">
          No videos found.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>

      {hasMore && !loading && videos.length > 0 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="bg-gray-800 hover:bg-gray-700 px-6 py-2 rounded-lg"
          >
            Load More
          </button>
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array(8).fill().map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;