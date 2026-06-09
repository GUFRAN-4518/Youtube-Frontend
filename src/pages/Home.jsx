import { useEffect, useState, useContext } from "react";
import { getAllVideos } from "../api/videoApi";
import VideoCard from "../components/VideoCard";
import SkeletonCard from "../components/SkeletonCard";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import FullPageLoader from "../components/FullPageLoader";

const Home = () => {
  const { user } = useContext(AuthContext);

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
      setError(err.response?.data?.message || "Failed to fetch videos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchVideos(page);
    }
  }, [page, user]);

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="bg-white/5 border border-white/10 p-10 rounded-3xl text-center max-w-md shadow-2xl backdrop-blur-sm">
          <h2 className="text-3xl font-bold text-white mb-4">
            Welcome to Clipjoy
          </h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Sign in to discover, watch, and share your favorite moments with the world.
          </p>
          <a
            href="/login"
            className="inline-block bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white px-8 py-3 rounded-full font-semibold shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all duration-300 transform hover:-translate-y-1"
          >
            Sign In Now
          </a>
        </div>
      </div>
    );
  }

  if(loading){
    return <FullPageLoader/>;
  }

  return (
    <div className="pb-10">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-8 text-sm font-medium">
          {error}
        </div>
      )}

      {!loading && videos.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-20 text-center">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">📭</span>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No videos yet</h3>
          <p className="text-gray-400">Check back later or be the first to upload!</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
        {loading && Array(8).fill().map((_, i) => <SkeletonCard key={i} />)}
      </div>

      {hasMore && !loading && videos.length > 0 && (
        <div className="flex justify-center mt-12">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 active:scale-95"
          >
            Load More Videos
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;