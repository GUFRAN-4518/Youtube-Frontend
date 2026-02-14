import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullname: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!avatar) {
      setError("Avatar is required");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();

      data.append("fullname", formData.fullname);
      data.append("username", formData.username);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("avatar", avatar);

      if (coverImage) {
        data.append("coverImage", coverImage);
      }

      await api.post("/users/register", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Account created successfully! Redirecting...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-xl shadow-lg">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Create Your Account
        </h2>

        {error && (
          <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/20 text-green-400 p-3 rounded mb-4 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Full Name */}
          <div>
            <label className="block mb-1 text-sm text-gray-400">
              Full Name
            </label>
            <input
              type="text"
              name="fullname"
              required
              value={formData.fullname}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block mb-1 text-sm text-gray-400">
              Username
            </label>
            <input
              type="text"
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-sm text-gray-400">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 text-sm text-gray-400">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
            />
          </div>

          {/* Avatar (Required) */}
          <div>
            <label className="block mb-1 text-sm text-gray-400">
              Avatar (Required)
            </label>
            <input
              type="file"
              accept="image/*"
              required
              onChange={(e) =>
                setAvatar(e.target.files[0])
              }
              className="w-full"
            />
          </div>

          {/* Cover Image (Optional) */}
          <div>
            <label className="block mb-1 text-sm text-gray-400">
              Cover Image (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setCoverImage(e.target.files[0])
              }
              className="w-full"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 transition py-2 rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Register"}
          </button>

        </form>

        <p className="text-sm text-gray-400 mt-6 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-red-500 hover:underline"
          >
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;