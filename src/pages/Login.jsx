import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const [formData, setFormData] = useState({ email: "", password: "" });
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
        <div className="min-h-[85vh] flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md bg-[#0a0a0a] border-2 border-white p-8 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
                
                {/* Decorative background glow */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-600/20 rounded-full blur-[60px] pointer-events-none"></div>

                <div className="text-center mb-8 relative z-10">
                    <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">
                        Welcome Back
                    </h2>
                    <p className="text-gray-400 text-sm">
                        Sign in to continue to Clipjoy
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm font-medium relative z-10">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-300">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all duration-300"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-300">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all duration-300"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white py-3.5 rounded-xl font-semibold shadow-[0_0_15px_rgba(220,38,38,0.2)] hover:shadow-[0_0_25px_rgba(220,38,38,0.4)] transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <p className="text-sm text-gray-400 mt-8 text-center relative z-10">
                    Don’t have an account?{" "}
                    <Link
                        to="/register"
                        className="text-red-500 hover:text-red-400 font-medium transition-colors"
                    >
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;