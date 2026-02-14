import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Upload = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [isPublished, setIsPublished] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!thumbnail || !videoFile) {
      setError("Thumbnail and Video are required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("thumbnail", thumbnail);
      formData.append("videoFile", videoFile);
      formData.append("isPublished", isPublished);

      const res = await api.post("/videos", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate(`/video/${res.data.data._id}`);

    } catch (err) {
      setError(
        err.response?.data?.message || "Upload failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 rounded-2xl p-15 bg-white">

      <h1 className="text-2xl text-black mb-6 text-center font-bold">
        Upload Video
      </h1>

      {error && (
        <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Title */}
        <div>
          <label className="block text-sm text-black font-bold mb-1 ">
            Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 bg-amber-50 rounded-lg border text-black border-gray-700"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm text-black mb-1 font-bold ">
            Description
          </label>
          <textarea
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-700 text-black bg-amber-50"
          />
        </div>

        {/* Thumbnail */}
        <div>
          <label className="block text-sm text-black font-bold mb-1">
            Thumbnail
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files[0])}
            className="border-2 rounded-[5px] invert px-2 border-gray-700 bg-gray-950"
          />
        </div>

        {/* Video File */}
        <div>
          <label className="block text-sm text-black font-bold mb-1">
            Video File
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
            className="border-2 rounded-[5px] invert px-2 border-gray-700 bg-gray-950"
          />
        </div>

        {/* Publish Toggle */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={() =>
              setIsPublished((prev) => !prev)
            }
          />
          <span className="text-black font-medium">
            Publish Immediately
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-red-600 px-6 py-2 rounded-lg font-semibold"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>

      </form>

    </div>
  );
};

export default Upload;
