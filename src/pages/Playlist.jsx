import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import VideoCard from "../components/VideoCard";
import { Trash2, MinusCircle, Edit2 } from "lucide-react";

const Playlist = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const fetchPlaylist = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/playlists/${id}`);
      setPlaylist(res.data.data);
      setEditName(res.data.data.name);
      setEditDescription(res.data.data.description || "");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load playlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPlaylist(); }, [id]);

  const handleRemoveVideo = async (e, videoId) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await api.patch(`/playlists/remove/${id}/${videoId}`);
      
      setPlaylist((prev) => ({
        ...prev,
        videos: prev.videos.filter((video) => video._id !== videoId),
      }));
    } catch (err) {
      console.error("Remove video error:", err);
    }
  };

  const handleDeletePlaylist = async () => {
    if (!window.confirm("Are you sure you want to permanently delete this playlist?")) return;
    try {
      await api.delete(`/playlists/${id}`);
      navigate("/playlists");
    } catch (err) {
      console.error("Delete playlist error:", err);
    }
  };

  const handleUpdatePlaylist = async () => {
    if (!editName.trim()) return;
    try {
      const res = await api.patch(`/playlists/${id}`, {
        name: editName,
        description: editDescription
      });
      setPlaylist((prev) => ({ ...prev, name: res.data.data.name, description: res.data.data.description }));
      setIsEditing(false);
    } catch (err) {
      console.error("Update playlist error:", err);
    }
  };

  if (loading) return <div className="text-center mt-20 text-gray-500">Unpacking index files...</div>;
  if (error) return <div className="text-center mt-20 text-red-400 font-medium">{error}</div>;
  if (!playlist) return null;

  const isOwner = user?._id === (playlist?.owner?._id || playlist?.owner);

  return (
    <div className="max-w-6xl mx-auto pb-12 px-4">
      <div className="bg-white/5 border border-white/5 p-6 sm:p-8 rounded-2xl mb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-6">

        <div className="flex-1 w-full">
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-red-500/50 text-xl font-bold"
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-red-500/50 resize-none h-24 text-sm"
              />
              <div className="flex gap-3 mt-2">
                <button onClick={handleUpdatePlaylist} className="bg-white text-black px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-gray-200">Save</button>
                <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-white px-4 py-1.5 text-sm">Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">{playlist.name}</h1>
              <p className="text-gray-400 text-sm mt-2 max-w-xl leading-relaxed">{playlist.description || "No description for this item track."}</p>
              <p className="text-gray-500 text-xs font-semibold mt-3 tracking-wide uppercase">{playlist.videos.length} videos</p>
            </>
          )}
        </div>

        {isOwner && !isEditing && (
          <div className="flex gap-3 self-start sm:self-center shrink-0">
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-white/10 border border-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer"
            >
              <Edit2 size={16} />
              Edit
            </button>
            <button
              onClick={handleDeletePlaylist}
              className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500 text-red-400 hover:text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        )}
      </div>

      {playlist.videos.length === 0 ? (
        <div className="text-gray-500 text-sm py-12 text-center bg-white/5 rounded-2xl border border-dashed border-white/10">Playlist is empty</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
          {playlist.videos.map((video) => (
            <div key={video._id} className="relative group/item bg-white/5 border border-white/5 p-2.5 rounded-2xl">
              <VideoCard video={video} />
              {isOwner && (
                <button
                  onClick={(e) => handleRemoveVideo(e, video._id)}

                  className="cursor-pointer absolute top-4 right-4 flex items-center justify-center bg-black/60 backdrop-blur-md text-red-400 hover:text-red-300 p-2 rounded-lg opacity-0 group-hover/item:opacity-100 transition-all duration-200"
                  title="Remove from playlist"
                >
                  <MinusCircle size={16} />
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