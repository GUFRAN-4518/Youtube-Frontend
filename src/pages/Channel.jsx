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
        setError(err.response?.data?.message || "Failed to load channel");
      } finally {
        setLoading(false);
      }
    };
    fetchChannel();
  }, [username]);

  if (loading) return <div className="text-center mt-20 text-gray-500">Retrieving channel portfolio...</div>;
  if (error) return <div className="text-center mt-20 text-red-400 font-medium">{error}</div>;
  if (!channel) return null;

  return (
    <div className="max-w-6xl mx-auto pb-12 px-4">
      {/* Cover Image Wrapper */}
      <div className="w-full h-32 sm:h-48 border border-white/10 rounded-2xl mb-8 overflow-hidden bg-white/5 relative shadow-inner">
        {channel.coverImage ? (
          <img src={channel.coverImageUrl || channel.coverImage} alt="cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-red-950/20 to-neutral-900" />
        )}
      </div>

      {/* Identity Configuration Block */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5 mb-10 border-b border-white/5 pb-8">
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-red-500/50 p-0.5 shrink-0 shadow-xl bg-gray-900">
          <img src={channel.avatar || "https://via.placeholder.com/150"} alt="avatar" className="w-full h-full object-cover rounded-full" />
        </div>
        <div className="pt-2">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">{channel.username}</h1>
          <p className="text-gray-400 text-sm font-medium mt-1">
            {channel.subscribersCount?.toLocaleString() || 0} subscribers
          </p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-white mb-6">Videos</h2>
      {channel.videos?.length === 0 ? (
        <div className="text-gray-500 text-sm py-12 text-center bg-white/5 rounded-2xl border border-dashed border-white/10">
          This creator hasn't published any streams yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {channel.videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Channel;