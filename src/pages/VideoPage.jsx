import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { getVideoById } from "../api/videoApi";
import { AuthContext } from "../context/AuthContext";

import LikeButton from "../components/LikeButton";
import SubscribeButton from "../components/SubscribeButton";
import CommentSection from "../components/CommentSection";

const VideoPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

      {/* Video Title */}
      <h1 className="text-2xl font-bold mt-1">
        {video.title}
      </h1>

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