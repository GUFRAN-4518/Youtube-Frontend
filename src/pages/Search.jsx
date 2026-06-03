import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { searchVideos } from "../api/videoApi";
import VideoCard from "../components/VideoCard";

const Search = () => {
  const location = useLocation();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("q");

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) return;
      try {
        setLoading(true);
        setError("");
        const res = await searchVideos(query);
        setVideos(res.data.data.videos);
      } catch (err) {
        setError(err.response?.data?.message || "Search execution encountered an error.");
      } finally {
        setLoading(false);
      }
    };
    fetchSearchResults();
  }, [query]);

  if (!query) return <div className="text-center mt-20 text-gray-500 text-sm">Please input query parameters to search track indices.</div>;
  if (loading) return <div className="text-center mt-20 text-gray-500 text-sm">Parsing query targets for "{query}"...</div>;
  if (error) return <div className="text-center mt-20 text-red-400 font-medium">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto pb-12 px-4">
      <h1 className="text-xl font-medium text-gray-400 mb-8">
        Search Results for <span className="text-white font-extrabold text-2xl tracking-tight ml-1">"{query}"</span>
      </h1>

      {videos.length === 0 ? (
        <div className="text-gray-500 text-sm py-16 text-center bg-white/5 rounded-2xl border border-dashed border-white/10 max-w-xl mx-auto">
          No records matching your execution targets found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;