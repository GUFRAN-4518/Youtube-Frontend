import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { FolderPlus, ListVideo } from "lucide-react";
import FullPageLoader from "../components/FullPageLoader";

const Playlists = () => {
    const { user } = useContext(AuthContext);
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/playlists/user/${user._id}`);
                setPlaylists(res.data.data ?? []);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load playlists");
            } finally {
                setLoading(false);
            }
        };
        if (user?._id) fetchPlaylists();
    }, [user]);

    const handleCreatePlaylist = async () => {
        if (!name.trim()) return;
        try {
            const res = await api.post("/playlists", { name, description });
            setPlaylists((prev) => [res.data.data, ...prev]);
            setName(""); setDescription(""); setShowForm(false);
        } catch (err) {
            console.error("Create playlist failed", err);
        }
    };

    if (loading) return <FullPageLoader />;
    if (error) return <div className="text-center mt-20 text-red-400 font-medium">{error}</div>;

    return (
        <div className="max-w-6xl mx-auto pb-12 px-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-extrabold text-white tracking-tight">My Playlists</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg transition-all duration-300 active:scale-95"
                >
                    <FolderPlus size={16} />
                    Create Playlist
                </button>
            </div>

            {showForm && (
                <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-2xl mb-8 animate-in fade-in slide-in-from-top-4 duration-300 max-w-xl">
                    <input
                        type="text"
                        placeholder="Playlist title"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full mb-4 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-red-500/50"
                    />
                    <textarea
                        placeholder="Description (optional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full mb-4 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-red-500/50 resize-none h-24"
                    />
                    <button onClick={handleCreatePlaylist} className="bg-white text-black px-6 py-2 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                        Save Playlist
                    </button>
                </div>
            )}

            {playlists.length === 0 ? (
                <p className="text-gray-500 text-sm">Your digital archive is currently empty.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {playlists.map((playlist) => {
                        const previewVideo = playlist.videos?.[0];
                        return (
                            <Link key={playlist._id} to={`/playlist/${playlist._id}`} className="group bg-white/5 border border-white/5 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:border-white/10">
                                <div className="aspect-video bg-gray-900 relative border-b border-white/5 overflow-hidden">
                                    {previewVideo ? (
                                        <img src={previewVideo.thumbnail} alt="preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-700"><ListVideo size={36} /></div>
                                    )}
                                </div>
                                <div className="p-5">
                                    <h3 className="font-bold text-gray-100 group-hover:text-red-400 transition-colors line-clamp-1">{playlist.name}</h3>
                                    <p className="text-gray-400 text-xs font-medium mt-1">{playlist.videos.length} videos</p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Playlists;