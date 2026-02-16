import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { getVideoById } from "../api/videoApi";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";

import LikeButton from "../components/LikeButton";
import SubscribeButton from "../components/SubscribeButton";
import CommentSection from "../components/CommentSection";

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
      alert("Added to playlist!");
      setShowPlaylistModal(false);
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Failed to add video"
      );
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
        setError(
          err.response?.data?.message || "Failed to load video"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-400">
        Loading video...
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

  if (!video) return null;

  const isOwner = user?._id === video.owner?._id;

  return (
    <div className="max-w-6x">

      {/* Video Player */}
      <div className="w-full aspect-video bg-black rounded-xl overflow-hidden">
        <video
          src={video.videoFile}
          controls
          className="w-full h-full"
        />
      </div>

      {/* Video Title and Add to playlist option */}
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mt-1">
          {video.title}
        </h1>
        <button
          onClick={() => setShowPlaylistModal(true)}
          className="bg-gray-800 px-4 py-2 rounded"
        >
          Add to Playlist
        </button>
        {showPlaylistModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-6 rounded-xl w-96">

              <h2 className="text-xl font-bold mb-4">
                Add to Playlist
              </h2>

              {playlists.length === 0 ? (
                <p className="text-gray-400">
                  No playlists found.
                </p>
              ) : (
                <div className="space-y-3">
                  {playlists.map((playlist) => (
                    <button
                      key={playlist._id}
                      onClick={() => handleAddToPlaylist(playlist._id)}
                      className="w-full text-left p-3 bg-gray-800 rounded hover:bg-gray-700"
                    >
                      {playlist.name}
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={() => setShowPlaylistModal(false)}
                className="mt-4 text-red-500"
              >
                Close
              </button>

            </div>
          </div>
        )}

      </div>

      {/* Views + Date */}
      <p className="text-gray-400 mt-1">
        {video.views} views •{" "}
        {new Date(video.createdAt).toLocaleDateString()}
      </p>

      {/* Channel + Actions */}
      <div className="flex items-center justify-between mt-6">

        {/* Channel Info */}
        <div className="flex items-center gap-4">

          <div className="w-12 h-12 bg-gray-700 rounded-full" />

          <div>
            <p className="font-semibold">
              {video.owner?.username}
            </p>
            <p className="text-gray-400 text-sm">
              {video.owner?.subscribersCount || 0} subscribers
            </p>
          </div>

          {!isOwner && (
            <SubscribeButton channelId={video.owner?._id} />
          )}
        </div>

        {/* Like Button */}
        <LikeButton videoId={video._id} />

      </div>


      {/* Description */}
      <div className="bg-gray-900 p-4 rounded-xl mt-6">
        <p className="whitespace-pre-line">
          {video.description}
        </p>
      </div>

      {/* Comments */}
      <div className="mt-8">
        <CommentSection videoId={video._id} />
      </div>

    </div>
  );
};

export default VideoPage;