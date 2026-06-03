// frontend/src/pages/VideoPage.jsx
import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { getVideoById } from "../api/videoApi";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";

import LikeButton from "../components/LikeButton";
import SubscribeButton from "../components/SubscribeButton";
import CommentSection from "../components/CommentSection";
import { FolderPlus, X } from "lucide-react";

const VideoPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    if (!user?._id) return;
    const fetchPlaylists = async () => {
      try {
        const res = await api.get(`/playlists/user/${user._id}`);
        setPlaylists(res.data.data ?? []);
      } catch (err) {
        console.error("Failed to fetch playlists", err);
      }
    };
    fetchPlaylists();
  }, [user]);

  const handleAddToPlaylist = async (playlistId) => {
    try {
      await api.patch(`/playlists/add/${video._id}/${playlistId}`);
      setShowPlaylistModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getVideoById(id);
        setVideo(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load video");
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [id]);

  if (loading) return <div className="text-center mt-20 text-gray-500 animate-pulse">Loading video...</div>;
  if (error) return <div className="text-center mt-20 text-red-400 font-medium">{error}</div>;
  if (!video) return null;

  const isOwner = user?._id?.toString() === video.owner?._id?.toString();

  return (
    <div className="max-w-[1300px] mx-auto pb-12 px-4 lg:px-6">
      {/* Video Player Box */}
      <div className="w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/5 relative">
        <video src={video.videoFile} controls autoPlay className="w-full h-full object-contain" />
      </div>

      {/* Meta Content Header */}
      <div className="mt-6 flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight">
            {video.title}
          </h1>
          <p className="text-gray-400 text-sm mt-1.5 font-medium">
            {video.views?.toLocaleString() || 0} views <span className="mx-1.5">•</span> {new Date(video.createdAt).toLocaleDateString()}
          </p>
        </div>

        <button
          onClick={() => setShowPlaylistModal(true)}
          className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-5 py-2.5 rounded-full font-medium transition-all duration-300 self-start shrink-0"
        >
          <FolderPlus size={18} /> Add to Playlist
        </button>
      </div>

      {/* Creator Bar Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-5 border-b border-white/5">
        <div className="flex items-center gap-4">
          
          {/* Channel Redirect Wrapper */}
          <Link to={`/channel/${video.owner?.username}`} className="flex items-center gap-3.5 group cursor-pointer">
            <div className="w-12 h-12 bg-white/5 rounded-full border border-white/10 overflow-hidden shrink-0 group-hover:border-red-500/50 transition-all duration-300">
              <img src={video.owner?.avatar || "https://via.placeholder.com/150"} alt="channel avatar" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-bold text-gray-100 group-hover:text-red-400 transition-colors duration-200">
                {video.owner?.username}
              </p>
            </div>
          </Link>

          {/* Action Subscription Node */}
          <div className="ml-2">
            {!isOwner && video?.owner?._id && (
              <SubscribeButton channelId={video.owner._id} setVideo={setVideo} />
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <LikeButton videoId={video._id} />
        </div>
      </div>

      {/* Description Field */}
      <div className="bg-white/5 border border-white/5 p-4 sm:p-5 rounded-2xl mt-6">
        <p className="whitespace-pre-line text-gray-300 text-sm leading-relaxed">
          {video.description || "No description provided."}
        </p>
      </div>

      {/* Comment Engine Block */}
      <CommentSection videoId={video._id} />

      {/* Playlist Selector Portal Overlay Modal */}
      {showPlaylistModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Save Video To...</h2>
              <button onClick={() => setShowPlaylistModal(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {playlists.map((playlist) => (
                <button key={playlist._id} onClick={() => handleAddToPlaylist(playlist._id)} className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm text-gray-200">
                  {playlist.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPage;