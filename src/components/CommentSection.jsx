// frontend/src/components/CommentSection.jsx
import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { Send, Trash2, Pencil, X, Check } from "lucide-react";

const CommentSection = ({ videoId }) => {
  const { user } = useContext(AuthContext);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  // States tracking comment editing actions
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments/${videoId}`);
      setComments(res.data.data || []);
    } catch (err) {
      console.error("Fetch comments error:", err);
    }
  };

  useEffect(() => {
    if (videoId) fetchComments();
  }, [videoId]);

  // 1. Add Comment Core Action
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      setLoading(true);
      const res = await api.post(`/comments/${videoId}`, { content: newComment.trim() });
      setComments((prev) => [res.data.data, ...prev]);
      setNewComment("");
    } catch (err) {
      console.error("Add comment error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Initialize Inline Edit Mode Framework
  const startEditing = (comment) => {
    setEditingId(comment._id);
    setEditContent(comment.content);
  };

  // 3. Save Updated Comment Action (Implements updateComment)
  const handleUpdateComment = async (commentId) => {
    if (!editContent.trim()) return;
    try {
      setEditLoading(true);
      // Matches backend patch pathing framework: PATCH /api/v1/comments/c/:commentId
      const res = await api.patch(`/comments/c/${commentId}`, { content: editContent.trim() });
      
      // Update local state text while preserving populated author fields smoothly
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? { ...c, content: res.data.data.content } : c))
      );
      setEditingId(null);
    } catch (err) {
      console.error("Update comment error:", err);
    } finally {
      setEditLoading(false);
    }
  };

  // 4. Delete Comment Action (Implements deleteComment)
  const handleDelete = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      // Fixed targeted path mapping constraint to direct to /c/ sub-router rule
      await api.delete(`/comments/c/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error("Delete comment error:", err);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-white mb-6">
        Comments ({comments.length})
      </h2>

      {/* Add Comment Input Layout */}
      {user ? (
        <div className="flex gap-4 mb-8 items-start">
          <img
            src={user.avatar || "https://via.placeholder.com/150"}
            alt="user avatar"
            className="w-10 h-10 rounded-full object-cover border border-white/10 shrink-0"
          />
          <div className="flex-1 flex items-center bg-white/5 border border-white/10 rounded-full overflow-hidden focus-within:border-red-500/50 focus-within:ring-1 focus-within:ring-red-500/50 transition-all duration-300">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a public comment..."
              className="w-full bg-transparent text-white px-5 py-3 focus:outline-none placeholder-gray-500 text-sm"
              onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
            />
            <button
              onClick={handleAddComment}
              disabled={loading || !newComment.trim()}
              className="px-5 py-3 text-red-500 hover:text-red-400 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-8 p-4 bg-white/5 border border-white/10 rounded-xl text-center text-gray-400 text-sm">
          Please sign in to join the conversation.
        </div>
      )}

      {/* Structured Comment List Feed */}
      <div className="space-y-5">
        {comments.map((comment) => (
          <div key={comment._id} className="group flex gap-4 animate-in fade-in duration-300 items-start">
            <img
              src={comment.owner?.avatar || "https://via.placeholder.com/150"}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover border border-white/5 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-200 text-sm">
                  {comment.owner?.username || "Anonymous"}
                </span>
                <span className="text-gray-500 text-xs">
                  {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : ""}
                </span>
              </div>

              {/* Dynamic Presentation Block Conditional Routing Layout */}
              {editingId === comment._id ? (
                <div className="flex items-center gap-2 mt-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 w-full focus-within:border-red-500/40">
                  <input
                    type="text"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full bg-transparent text-white text-sm focus:outline-none"
                    onKeyDown={(e) => e.key === "Enter" && handleUpdateComment(comment._id)}
                    autoFocus
                  />
                  <div className="flex items-center gap-1 shrink-0">
                    <button 
                      onClick={() => handleUpdateComment(comment._id)}
                      disabled={editLoading || !editContent.trim()}
                      className="p-1 text-green-500 hover:text-green-400 transition-colors disabled:opacity-30"
                    >
                      <Check size={16} />
                    </button>
                    <button 
                      onClick={() => setEditingId(null)}
                      className="p-1 text-gray-400 hover:text-white transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-300 text-sm leading-relaxed break-words">
                  {comment.content}
                </p>
              )}
            </div>

            {/* Privileged Identity Management Trigger System Keys */}
            {user?._id === comment.owner?._id && editingId !== comment._id && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0">
                <button
                  onClick={() => startEditing(comment)}
                  className="text-gray-500 hover:text-white p-1.5 transition-colors"
                  title="Modify message context"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => handleDelete(comment._id)}
                  className="text-gray-500 hover:text-red-500 p-1.5 transition-colors"
                  title="Purge recorded message document"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;