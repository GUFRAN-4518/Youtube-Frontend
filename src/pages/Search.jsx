import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { searchVideos } from "../api/videoApi";
import VideoCard from "../components/VideoCard";

const Search = () => {
  const location = useLocation();

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Extract query from URL
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
        setError(
          err.response?.data?.message || "Search failed"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  if (!query) {
    return (
      <div className="text-center mt-10 text-gray-400">
        No search query provided.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-400">
        Searching for "{query}"...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">

      <h1 className="text-xl font-semibold mb-6">
        Search Results for "{query}"
      </h1>

      {videos.length === 0 ? (
        <div className="text-gray-400 text-center">
          No videos found.
        </div>
      ) : (
        <div className="
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          md:grid-cols-3 
          lg:grid-cols-4 
          gap-6
        ">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}

    </div>
  );
};

export default Search;