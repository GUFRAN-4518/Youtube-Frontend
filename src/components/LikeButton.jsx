import { useState, useEffect } from "react";
import api from "../api/axios";

const LikeButton = ({ videoId }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const res = await api.get(`/likes/status/v/${videoId}`);
        setLiked(res.data.data.liked);
        setLikesCount(res.data.data.likesCount);
      } catch (err) {
        console.error("Fetch like error:", err);
      }
    };

    fetchLikes();
  }, [videoId]);

  const toggleLike = async () => {
    if (loading) return;

    const prevLiked = liked;

    setLiked(!liked);
    setLikesCount(prev => prev + (liked ? -1 : 1));

    try {
      setLoading(true);

      const res = await api.post(`/likes/toggle/v/${videoId}`);

      setLiked(res.data.data.liked);
      setLikesCount(res.data.data.likesCount);

    } catch (err) {
      if (err.response?.status === 401) {
        window.location.href = "/login";
        return;
      }

      setLiked(prevLiked);
      setLikesCount(prev => prev + (prevLiked ? 1 : -1));

      console.error("Like error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleLike}
      disabled={loading}
      className={`px-5 py-2.5 rounded-full flex items-center gap-2.5 font-medium text-sm transition-all duration-300 active:scale-95 ${
        liked
          ? "bg-red-500/10 text-red-500 border border-red-500/20"
          : "bg-white/5 text-gray-300 hover:bg-white/10 border border-transparent"
      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <svg 
        className={`w-5 h-5 ${liked ? "fill-current" : "fill-none stroke-current stroke-2"}`} 
        viewBox="0 0 24 24"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
      {likesCount.toLocaleString()}
    </button>
  );
};

export default LikeButton;