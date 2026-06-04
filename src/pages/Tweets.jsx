import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { Send, Trash2, Pencil, X, Check, MessageSquare } from "lucide-react";

const Tweets = () => {
  const { user } = useContext(AuthContext);

  const [tweets, setTweets] = useState([]);
  const [newTweet, setNewTweet] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  // Fetch all tweets for the user
  const fetchTweets = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get(`/tweets/user/${user?._id}`);
      setTweets(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load community feed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) fetchTweets();
  }, [user]);

  // 1. Create a Tweet
  const handleCreateTweet = async (e) => {
    e.preventDefault();
    if (!newTweet.trim()) return;

    try {
      setSubmitLoading(true);
      const res = await api.post("/tweets", { content: newTweet.trim() });
      
      const freshTweet = {
        ...res.data.data,
        owner: {
          _id: user._id,
          username: user.username,
          avatar: user.avatar
        }
      };

      setTweets((prev) => [freshTweet, ...prev]);
      setNewTweet("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to post tweet");
    } finally {
      setSubmitLoading(false);
    }
  };

  // 2. Start Inline Edit Form
  const startEditing = (tweet) => {
    setEditingId(tweet._id);
    setEditContent(tweet.content);
  };

  // 3. Save Updated Tweet Content (Implements updateTweet)
  const handleUpdateTweet = async (tweetId) => {
    if (!editContent.trim()) return;

    try {
      setEditLoading(true);
      const res = await api.patch(`/tweets/${tweetId}`, { content: editContent.trim() });

      setTweets((prev) =>
        prev.map((t) => (t._id === tweetId ? { ...t, content: res.data.data.content } : t))
      );
      setEditingId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setEditLoading(false);
    }
  };

  // 4. Delete Tweet Action (Implements deleteTweet)
  const handleDeleteTweet = async (tweetId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await api.delete(`/tweets/${tweetId}`);
      setTweets((prev) => prev.filter((t) => t._id !== tweetId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete post");
    }
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-white/5 border border-white/10 p-10 rounded-3xl text-center max-w-md shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-4">Community Feed</h2>
          <p className="text-gray-400 mb-6">Sign in to share updates and talk with creators.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-12 px-4">
      <div className="flex items-center gap-3 mb-8">
        <MessageSquare className="text-red-500 w-8 h-8" />
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Community Thoughts</h1>
      </div>

      {/* Tweet Composer Field */}
      <div className="bg-[#0a0a0a] border border-white/10 p-5 rounded-2xl mb-8 shadow-xl">
        <form onSubmit={handleCreateTweet}>
          <div className="flex gap-4 items-start">
            <img
              src={user.avatar || "https://via.placeholder.com/150"}
              alt="avatar"
              className="w-11 h-11 rounded-full object-cover border border-white/10 shrink-0"
            />
            <div className="flex-1">
              <textarea
                value={newTweet}
                onChange={(e) => setNewTweet(e.target.value)}
                placeholder="What's on your mind? Share an update..."
                rows="3"
                maxLength={300}
                className="w-full bg-transparent text-white placeholder-gray-500 text-sm focus:outline-none resize-none pt-2"
              />
              <div className="flex justify-between items-center pt-3 border-t border-white/5 mt-2">
                <span className="text-xs text-gray-500 font-medium">
                  {300 - newTweet.length} characters left
                </span>
                <button
                  type="submit"
                  disabled={submitLoading || !newTweet.trim()}
                  className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white px-5 py-2 rounded-full text-xs font-bold shadow-md disabled:opacity-40 transition-all duration-300"
                >
                  <Send size={12} />
                  {submitLoading ? "Posting..." : "Post Update"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Stream Render List */}
      {error && <div className="text-red-400 text-sm font-medium p-4 bg-red-500/10 border border-red-500/20 rounded-xl mb-6">{error}</div>}
      
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white/5 border border-white/5 h-28 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : tweets.length === 0 ? (
        <div className="text-center py-16 bg-white/5 border border-dashed border-white/10 rounded-2xl text-gray-500 text-sm">
          No thoughts broadcasted yet. Be the first to share!
        </div>
      ) : (
        <div className="space-y-4">
          {tweets.map((tweet) => {
            const tweetOwner = tweet.owner?._id ? tweet.owner : user; // Fallback context matching
            return (
              <div
                key={tweet._id}
                className="group bg-white/5 border border-white/5 p-5 rounded-2xl shadow-md transition-all hover:border-white/10 flex gap-4 items-start animate-in fade-in duration-200"
              >
                <img
                  src={tweetOwner?.avatar || "https://via.placeholder.com/150"}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover border border-white/5 shrink-0"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-200 text-sm">{tweetOwner?.username}</span>
                    <span className="text-gray-500 text-xs">
                      {tweet.createdAt ? new Date(tweet.createdAt).toLocaleDateString() : "Just now"}
                    </span>
                  </div>

                  {editingId === tweet._id ? (
                    <div className="flex items-center gap-2 mt-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 w-full">
                      <input
                        type="text"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full bg-transparent text-white text-sm focus:outline-none"
                        onKeyDown={(e) => e.key === "Enter" && handleUpdateTweet(tweet._id)}
                        autoFocus
                      />
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleUpdateTweet(tweet._id)}
                          disabled={editLoading || !editContent.trim()}
                          className="p-1 text-green-500 hover:text-green-400"
                        >
                          <Check size={16} />
                        </button>
                        <button onClick={() => setEditingId(null)} className="p-1 text-gray-400 hover:text-white">
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {tweet.content}
                    </p>
                  )}
                </div>

                {/* Management controls for text owner */}
                {user._id === tweetOwner?._id && editingId !== tweet._id && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button onClick={() => startEditing(tweet)} className="text-gray-500 hover:text-white p-1">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDeleteTweet(tweet._id)} className="text-gray-500 hover:text-red-500 p-1">
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Tweets;