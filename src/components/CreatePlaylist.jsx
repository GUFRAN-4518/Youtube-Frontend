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

      // Redirect to newly created playlist
      navigate(`/playlist/${res.data.data._id}`);

    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create playlist"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">
        Create New Playlist
      </h1>

      {error && (
        <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Playlist Name */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Playlist Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter playlist name"
            className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Description (Optional)
          </label>
          <textarea
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your playlist"
            className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg font-semibold transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Playlist"}
        </button>

      </form>

    </div>
  );
};

export default CreatePlaylist;