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
      className={`px-4 py-2 rounded-full flex items-center gap-2 transition ${
        liked
          ? "bg-red-600"
          : "bg-gray-800 hover:bg-gray-700"
      } ${loading ? "opacity-50" : ""}`}
    >
      {liked ? "❤️" : "🤍"} {likesCount}
    </button>
  );
};

export default LikeButton;