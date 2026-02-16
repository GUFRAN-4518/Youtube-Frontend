import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

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
                setError("");

                const res = await api.get(
                    `/playlists/user/${user._id}`
                );

                setPlaylists(res.data.data ?? []);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Failed to load playlists"
                );
            } finally {
                setLoading(false);
            }
        };

        if (user?._id) {
            fetchPlaylists();
        }
    }, [user]);

    if (loading) {
        return (
            <div className="text-center mt-10 text-gray-400">
                Loading playlists...
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center mt-10 text-red-400">
                {error}
            </div>
        );
    }

    const handleCreatePlaylist = async () => {
        try {
            const res = await api.post("/playlists", {
                name,
                description
            });

            setPlaylists((prev) => [res.data.data, ...prev]);

            setName("");
            setDescription("");
            setShowForm(false);

        } catch (err) {
            console.error("Create playlist failed", err);
        }
    };


    return (
        <div className="max-w-6xl mx-auto">

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">
                    My Playlists
                </h1>

                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-red-600 px-4 py-2 rounded-lg cursor-pointer"
                >
                    + Create Playlist
                </button>
            </div>
            {showForm && (
                <div className="bg-gray-900 p-6 rounded-xl mb-8">
                    <input
                        type="text"
                        placeholder="Playlist name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full mb-4 p-2 bg-gray-800 rounded"
                    />

                    <textarea
                        placeholder="Description (optional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full mb-4 p-2 bg-gray-800 rounded"
                    />

                    <button
                        onClick={handleCreatePlaylist}
                        className="bg-red-600 px-4 py-2 rounded"
                    >
                        Create
                    </button>
                </div>
            )}


            {playlists.length === 0 ? (
                <div className="text-gray-400">
                    You have no playlists yet.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {playlists.map((playlist) => {
                        const previewVideo = playlist.videos?.[0];

                        return (
                            <Link
                                key={playlist._id}
                                to={`/playlist/${playlist._id}`}
                                className="bg-gray-900 rounded-xl overflow-hidden hover:scale-105 transition"
                            >
                                {/* Thumbnail */}
                                <div className="h-40 bg-gray-800">
                                    {previewVideo ? (
                                        <img
                                            src={previewVideo.thumbnail}
                                            alt="Playlist thumbnail"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-500">
                                            No Videos
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="p-4">
                                    <h3 className="font-semibold text-lg">
                                        {playlist.name}
                                    </h3>

                                    <p className="text-gray-400 text-sm mt-1">
                                        {playlist.videos.length} videos
                                    </p>
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