import { useEffect, useState } from "react";
import api from "../api/axios";
import VideoCard from "../components/VideoCard";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const statsRes = await api.get("/dashboard/stats");
        const videosRes = await api.get("/dashboard/videos");

        setStats(statsRes.data.data);
        setVideos(videosRes.data.data ?? []);

      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-400">
        Loading dashboard...
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
  const handleToggle = async (videoId) => {
    try {
      const res = await api.patch(`/videos/toggle/publish/${videoId}`);

      setVideos((prev) =>
        prev.map((v) =>
          v._id === videoId ? { ...v, isPublished: res.data.data.isPublished } : v
        )
      );

    } catch (err) {
      console.error("Toggle failed", err);
    }
  };


  return (
    <div className="max-w-6xl mx-auto">

      <h1 className="text-3xl font-bold mb-8">
        Channel Dashboard
      </h1>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

          <div className="bg-gray-900 p-6 rounded-xl border-2 border-red-500">
            <p className="text-gray-400 text-sm">Total Videos</p>
            <p className="text-2xl font-bold mt-2">
              {stats.totalVideos}
            </p>
          </div>

          <div className="bg-gray-900 p-6 rounded-xl border-2 border-red-500">
            <p className="text-gray-400 text-sm">Total Views</p>
            <p className="text-2xl font-bold mt-2">
              {stats.totalViews}
            </p>
          </div>

          <div className="bg-gray-900 p-6 rounded-xl  border-2 border-red-500">
            <p className="text-gray-400 text-sm">Subscribers</p>
            <p className="text-2xl font-bold mt-2">
              {stats.totalSubscribers}
            </p>
          </div>

          <div className="bg-gray-900 p-6 rounded-xl  border-2 border-red-500">
            <p className="text-gray-400 text-sm">Total Likes</p>
            <p className="text-2xl font-bold mt-2">
              {stats.totalLikes}
            </p>
          </div>

        </div>
      )}

      {/* Channel Videos */}
      <h2 className="text-xl font-semibold mb-4">
        Your Videos
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {videos?.length === 0 ? (
          <p className="text-gray-400">No videos uploaded yet</p>
        ) : (
          // videos.map((video) => (
          //   <VideoCard key={video._id} video={video} />
          // ))
          videos.map((video) => (
            <div key={video._id} className="relative">

              <VideoCard video={video} />

              <button
                onClick={() => handleToggle(video._id)}
                className="absolute top-2 cursor-pointer right-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs"
              >
                {video.isPublished ? "publish" : "Unpublish"}
              </button>

            </div>
          ))

        )}

      </div>

    </div>
  );
};

export default Dashboard;