import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
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
        setLoading(true);

        const result = await login(formData.email, formData.password);

        if (result.success) {
            navigate("/");
        } else {
            setError(result.message);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
            <div className="w-full max-w-md bg-gray-900 p-8 rounded-xl shadow-lg">

                <h2 className="text-2xl font-bold mb-6 text-center">
                    Sign In to MyTube
                </h2>

                {error && (
                    <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

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
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-red-500"
                        />
                    </div>

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
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-red-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-red-600 hover:bg-red-700 transition py-2 rounded-lg font-semibold disabled:opacity-50"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <p className="text-sm text-gray-400 mt-6 text-center">
                    Don’t have an account?{" "}
                    <Link
                        to="/register"
                        className="text-red-500 hover:underline"
                    >
                        Register
                    </Link>
                </p>

            </div>
        </div>
    );
};

export default Login;
