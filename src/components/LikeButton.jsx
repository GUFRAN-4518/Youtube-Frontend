import { useState, useEffect } from "react";
import api from "../api/axios";

const LikeButton = ({ videoId }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Optional: fetch initial like status from video object if available
  }, []);

  const toggleLike = async () => {
    try {
      setLoading(true);

      const res = await api.post(
        `/likes/toggle/v/${videoId}`
      );

      setLiked(res.data.data.liked);
      setLikesCount(res.data.data.likesCount);

    } catch (err) {
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
      }`}
    >
      ❤️ {likesCount}
    </button>
  );
};

export default LikeButton;