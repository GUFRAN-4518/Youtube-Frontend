import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { UserPlus, Image, FileUser } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: "", email: "", password: "", fullname: "" });
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!avatar) { setError("Avatar image upload is a mandatory index constraint."); return; }
    setLoading(true);

    try {
      const data = new FormData();
      data.append("fullname", formData.fullname);
      data.append("username", formData.username);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("avatar", avatar);
      if (coverImage) data.append("coverImage", coverImage);

      await api.post("/users/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Account configuration successfully broadcasted. Moving portal...");
      setTimeout(() => { navigate("/login"); }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration sequence dropped");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl shadow-2xl relative">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Create Account</h2>
          <p className="text-gray-400 text-sm mt-1.5">Configure your custom portal parameters below</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm font-medium">{error}</div>}
        {success && <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl mb-6 text-sm font-medium">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Full Name</label>
              <input type="text" name="fullname" required value={formData.fullname} onChange={handleChange} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-red-500/50 text-sm" />
            </div>
            <div>
              <label className="block mb-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Username</label>
              <input type="text" name="username" required value={formData.username} onChange={handleChange} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-red-500/50 text-sm" />
            </div>
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Track</label>
            <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-red-500/50 text-sm" />
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Password Secret</label>
            <input type="password" name="password" required value={formData.password} onChange={handleChange} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-red-500/50 text-sm" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block mb-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Avatar <span className="text-red-500">*</span></label>
              <label className="flex items-center gap-3 w-full px-4 py-3 bg-white/5 border border-dashed border-white/20 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                <FileUser size={18} className="text-gray-400" />
                <span className="text-xs text-gray-400 truncate font-medium">{avatar ? avatar.name : "Upload Avatar"}</span>
                <input type="file" accept="image/*" required onChange={(e) => setAvatar(e.target.files[0])} className="hidden" />
              </label>
            </div>
            <div>
              <label className="block mb-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Cover Banner</label>
              <label className="flex items-center gap-3 w-full px-4 py-3 bg-white/5 border border-dashed border-white/20 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                <Image size={18} className="text-gray-400" />
                <span className="text-xs text-gray-400 truncate font-medium">{coverImage ? coverImage.name : "Optional Cover"}</span>
                <input type="file" accept="image/*" onChange={(e) => setCoverImage(e.target.files[0])} className="hidden" />
              </label>
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full mt-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white py-3 rounded-xl font-bold transition-all duration-300 shadow-md disabled:opacity-50"
          >
            {loading ? "Constructing Account Profile..." : "Complete Registration"}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-6 text-center">
          Already verified? <Link to="/login" className="text-red-500 hover:text-red-400 font-semibold transition-colors">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;