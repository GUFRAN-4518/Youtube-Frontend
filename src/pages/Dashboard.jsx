import { useEffect, useState } from "react";
import api from "../api/axios";
import VideoCard from "../components/VideoCard";
import { Tv, Eye, Users, Heart, EyeOff, Pencil, Trash2, X, UploadCloud } from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Editing Video States
  const [editingVideo, setEditingVideo] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editThumbnail, setEditThumbnail] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      const statsRes = await api.get("/dashboard/stats");
      const videosRes = await api.get("/dashboard/videos");
      setStats(statsRes.data.data);
      setVideos(videosRes.data.data ?? []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // 1. Toggle Publish Status
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

  // 2. Open Edit Modal and Initialize Values
  const openEditModal = (video) => {
    setEditingVideo(video);
    setEditTitle(video.title);
    setEditDescription(video.description || "");
    setEditThumbnail(null);
    setEditError("");
  };

  // 3. Submit Updated Video Data
  const handleUpdateVideo = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) {
      setEditError("Title cannot be empty.");
      return;
    }

    try {
      setEditLoading(true);
      setEditError("");

      const formData = new FormData();
      formData.append("title", editTitle.trim());
      formData.append("description", editDescription.trim());
      if (editThumbnail) {
        formData.append("thumbnail", editThumbnail);
      }

      const res = await api.patch(`/videos/${editingVideo._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Update local state smoothly
      setVideos((prev) =>
        prev.map((v) => (v._id === editingVideo._id ? { ...v, ...res.data.data } : v))
      );
      setEditingVideo(null);
    } catch (err) {
      setEditError(err.response?.data?.message || "Failed to update video");
    } finally {
      setEditLoading(false);
    }
  };

  // 4. Delete Video Action
  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm("Are you sure you want to permanently delete this video?")) return;

    try {
      await api.delete(`/videos/${videoId}`);
      // Filter out deleted item from state tree
      setVideos((prev) => prev.filter((v) => v._id !== videoId));
      // Refresh metric stats to match counter modifications
      const statsRes = await api.get("/dashboard/stats");
      setStats(statsRes.data.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete video");
    }
  };

  if (loading) return <div className="text-center mt-20 text-gray-500">Loading analysis systems...</div>;
  if (error) return <div className="text-center mt-20 text-red-400 font-medium">{error}</div>;

  const metricCards = stats ? [
    { label: "Total Videos", value: stats.totalVideos, icon: Tv },
    { label: "Total Views", value: stats.totalViews?.toLocaleString(), icon: Eye },
    { label: "Subscribers", value: stats.totalSubscribers?.toLocaleString(), icon: Users },
    { label: "Total Likes", value: stats.totalLikes?.toLocaleString(), icon: Heart },
  ] : [];

  return (
    <div className="max-w-6xl mx-auto pb-12 px-4">
      <h1 className="text-3xl font-extrabold text-white tracking-tight mb-8">
        Channel Dashboard
      </h1>

      {/* Metrics Config Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
        {metricCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white/5 border border-white/5 p-5 rounded-2xl relative overflow-hidden group">
              <div className="absolute -right-2 -bottom-2 text-white/5 group-hover:text-white/10 transition-colors pointer-events-none">
                <Icon size={90} />
              </div>
              <p className="text-gray-400 text-xs sm:text-sm font-medium">{card.label}</p>
              <p className="text-xl sm:text-3xl font-bold text-white mt-2 tracking-tight">{card.value ?? 0}</p>
            </div>
          );
        })}
      </div>

      <h2 className="text-xl font-bold text-white mb-6">Your Videos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {videos.length === 0 ? (
          <p className="text-gray-500 text-sm">No recorded streams matching your profile core.</p>
        ) : (
          videos.map((video) => (
            <div key={video._id} className="relative group/card bg-white/5 border border-white/5 rounded-2xl p-2.5 transition-all duration-300 hover:border-white/10">
              <VideoCard video={video} />
              
              {/* Floating Practical Action Row Control Bar */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                {/* Publish Status Toggle Badge */}
                <button
                  onClick={() => handleToggle(video._id)}
                  className={`flex items-center gap-1.5 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold shadow-md cursor-pointer transition-all duration-200 active:scale-95 ${
                    video.isPublished 
                      ? "bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30" 
                      : "bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/30"
                  }`}
                  title="Toggle Visibility Status"
                >
                  {video.isPublished ? <Eye size={12} /> : <EyeOff size={12} />}
                  {video.isPublished ? "Published" : "Draft"}
                </button>

                {/* Edit Pencil Action Key */}
                <button
                  onClick={() => openEditModal(video)}
                  className="p-2 bg-black/60 backdrop-blur-md border border-white/10 text-gray-300 hover:text-white rounded-lg shadow-md transition-colors"
                  title="Edit Parameters"
                >
                  <Pencil size={13} />
                </button>

                {/* Delete Bin Action Key */}
                <button
                  onClick={() => handleDeleteVideo(video._id)}
                  className="p-2 bg-black/60 backdrop-blur-md border border-red-500/20 text-red-400 hover:bg-red-600 hover:text-white rounded-lg shadow-md transition-all"
                  title="Delete Video Track"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Video Form Modal Overlay Overlay Portal */}
      {editingVideo && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a0a0a] border border-white/10 p-6 sm:p-8 rounded-2xl w-full max-w-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 relative">
            
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white tracking-tight">Edit Video Parameters</h3>
              <button 
                onClick={() => setEditingVideo(null)} 
                className="text-gray-400 hover:text-white p-1 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {editError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl mb-4 text-xs font-medium">
                {editError}
              </div>
            )}

            <form onSubmit={handleUpdateVideo} className="space-y-4">
              {/* Title Form Field */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Video Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-red-500/50 text-sm transition-colors"
                  placeholder="Update video layout heading"
                  required
                />
              </div>

              {/* Description Form Field */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Description Summary</label>
                <textarea
                  rows="3"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-red-500/50 text-sm transition-colors resize-none"
                  placeholder="Update track reference brief details..."
                />
              </div>

              {/* Thumbnail Form Field */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Replace Thumbnail Image</label>
                <label className="flex items-center gap-3 w-full px-4 py-3 bg-white/5 border border-dashed border-white/20 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                  <UploadCloud size={18} className="text-gray-400" />
                  <span className="text-xs text-gray-400 truncate font-medium">
                    {editThumbnail ? editThumbnail.name : "Select new image file (Optional)"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditThumbnail(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Submit Buttons Row */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setEditingVideo(null)}
                  className="px-4 py-2 text-sm font-semibold text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
                >
                  {editLoading ? "Saving Modifications..." : "Save Parameters"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;