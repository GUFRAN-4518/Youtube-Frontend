import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import VideoCard from "../components/VideoCard";

const Playlist = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPlaylist = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get(`/playlists/${id}`);
      setPlaylist(res.data.data);

    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load playlist"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylist();
  }, [id]);

  const handleRemoveVideo = async (videoId) => {
    try {
      await api.patch(`/playlists/remove/${id}/${videoId}`);

      setPlaylist((prev) => ({
        ...prev,
        videos: prev.videos.filter(
          (video) => video._id !== videoId
        ),
      }));

    } catch (err) {
      console.error("Remove video error:", err);
    }
  };

  const handleDeletePlaylist = async () => {
    try {
      await api.delete(`/playlists/${id}`);
      navigate("/dashboard");
    } catch (err) {
      console.error("Delete playlist error:", err);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-400">
        Loading playlist...
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

  if (!playlist) return null;

  const isOwner = user?._id === playlist.owner?._id;

  return (
    <div className="max-w-6xl mx-auto">

      {/* Playlist Header */}
      <div className="bg-gray-900 p-6 rounded-xl mb-8">

        <h1 className="text-3xl font-bold">
          {playlist.name}
        </h1>

        <p className="text-gray-400 mt-2">
          {playlist.description}
        </p>

        <p className="text-gray-500 mt-2 text-sm">
          {playlist.videos.length} videos
        </p>

        {isOwner && (
          <button
            onClick={handleDeletePlaylist}
            className="mt-4 bg-red-600 px-4 py-2 rounded-lg"
          >
            Delete Playlist
          </button>
        )}
      </div>

      {/* Videos */}
      {playlist.videos.length === 0 ? (
        <div className="text-gray-400 text-center">
          No videos in this playlist.
        </div>
      ) : (
        <div className="space-y-6">
          {playlist.videos.map((video) => (
            <div key={video._id} className="relative">

              <VideoCard video={video} />

              {isOwner && (
                <button
                  onClick={() =>
                    handleRemoveVideo(video._id)
                  }
                  className="absolute top-2 right-2 bg-black/70 text-red-400 px-3 py-1 text-sm rounded"
                >
                  Remove
                </button>
              )}

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Playlist;