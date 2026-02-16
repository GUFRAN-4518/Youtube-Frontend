import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import VideoCard from "../components/VideoCard";


const Channel = () => {
  const { username } = useParams();
  const { user } = useContext(AuthContext);

  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get(`/users/c/${username}`);
        setChannel(res.data.data);

      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load channel"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchChannel();
  }, [username]);

  if (loading) {
    return <div className="text-center mt-10 text-gray-400">Loading channel...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-400">{error}</div>;
  }

  if (!channel) return null;

  const isOwner = user?._id === channel._id;
  return (
    <div className="max-w-6xl mx-auto">

      {/* Cover Image */}
      <div className="w-full h-40 border-2 border-red-500 rounded-xl mb-6 overflow-hidden bg-gray-700">
          {channel.coverImage && (
            <img
              src={channel.coverImageUrl || channel.coverImage}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          )}
      </div>

      {/* Channel Info */}
      <div className="flex items-center gap-4 mb-8">

        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-700">
          {channel.avatar && (
            <img
              src={channel.avatar}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div>
          <h1 className="text-2xl font-bold">
            {channel.username}
          </h1>
          <p className="text-gray-400 mt-1">
            {channel.subscribersCount} subscribers
          </p>
        </div>
      </div>

      {/* Videos */}
      <h2 className="text-xl font-semibold mb-4">Videos</h2>

      {channel.videos?.length === 0 ? (
        <div className="text-gray-400 text-center">
          This channel has no videos yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {channel.videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Channel;