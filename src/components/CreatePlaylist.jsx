import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const CreatePlaylist = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Playlist name is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/playlists", {
        name: name.trim(),
        description: description.trim(),
      });

      navigate(`/playlist/${res.data.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create playlist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-2xl shadow-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Create Playlist
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Organize your favorite videos into custom collections.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Playlist Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Playlist Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Chill Coding Beats"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all duration-300"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description <span className="text-gray-600 text-xs font-normal ml-1">(Optional)</span>
            </label>
            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this playlist about?"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all duration-300 resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white py-3 rounded-xl font-semibold shadow-[0_0_15px_rgba(220,38,38,0.2)] hover:shadow-[0_0_25px_rgba(220,38,38,0.4)] transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Playlist"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePlaylist;