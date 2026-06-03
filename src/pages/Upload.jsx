import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { UploadCloud, FileImage, FileVideo } from "lucide-react";

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
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate(`/video/${res.data.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-6 pb-12 px-4">
      <div className="bg-[#0a0a0a] border border-white/10 p-6 sm:p-10 rounded-3xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Upload Video
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Share your video content with the Clipjoy community.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your video an attention-grabbing title"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all duration-300"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell viewers what your video is about..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all duration-300 resize-none"
            />
          </div>

          {/* File Upload Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Thumbnail */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Thumbnail Image <span className="text-red-500">*</span>
              </label>
              <label className="flex flex-col items-center justify-center aspect-video w-full bg-white/5 border border-dashed border-white/20 rounded-2xl cursor-pointer hover:bg-white/10 hover:border-red-500/50 transition-all duration-300 group">
                <div className="text-center p-4">
                  <FileImage className="mx-auto text-gray-500 group-hover:text-red-500 mb-2 transition-colors" size={28} />
                  <span className="text-sm text-gray-400 block font-medium">
                    {thumbnail ? thumbnail.name : "Select Thumbnail"}
                  </span>
                  <span className="text-xs text-gray-600 block mt-1">PNG, JPG up to 5MB</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbnail(e.target.files[0])}
                  className="hidden"
                />
              </label>
            </div>

            {/* Video File */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Video File <span className="text-red-500">*</span>
              </label>
              <label className="flex flex-col items-center justify-center aspect-video w-full bg-white/5 border border-dashed border-white/20 rounded-2xl cursor-pointer hover:bg-white/10 hover:border-red-500/50 transition-all duration-300 group">
                <div className="text-center p-4">
                  <UploadCloud className="mx-auto text-gray-500 group-hover:text-red-500 mb-2 transition-colors" size={28} />
                  <span className="text-sm text-gray-400 block font-medium">
                    {videoFile ? videoFile.name : "Select Video Source"}
                  </span>
                  <span className="text-xs text-gray-600 block mt-1">MP4, WebM up to 100MB</span>
                </div>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files[0])}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Publish Toggle */}
          <div className="flex items-center gap-3 py-2">
            <input
              type="checkbox"
              id="publishToggle"
              checked={isPublished}
              onChange={() => setIsPublished((prev) => !prev)}
              className="w-4 block h-4 accent-red-600 rounded cursor-pointer"
            />
            <label htmlFor="publishToggle" className="text-gray-300 text-sm font-medium cursor-pointer selection:bg-transparent select-none">
              Publish video instantly to your public feed
            </label>
          </div>

          {/* Actions */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white py-3.5 rounded-xl font-semibold shadow-[0_0_15px_rgba(220,38,38,0.2)] hover:shadow-[0_0_25px_rgba(220,38,38,0.4)] transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing Upload..." : "Upload & Launch"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Upload;