import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const CommentSection = ({ videoId }) => {
  const { user } = useContext(AuthContext);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    try {
      const res = await api.get(
        `/comments/video/${videoId}`
      );
      setComments(res.data.data.comments);
    } catch (err) {
      console.error("Fetch comments error:", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      setLoading(true);

      const res = await api.post(
        `/comments/${videoId}`,
        { content: newComment }
      );

      setComments((prev) => [
        res.data.data,
        ...prev,
      ]);

      setNewComment("");

    } catch (err) {
      console.error("Add comment error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);

      setComments((prev) =>
        prev.filter((c) => c._id !== commentId)
      );

    } catch (err) {
      console.error("Delete comment error:", err);
    }
  };

  return (
    <div>

      <h2 className="text-lg font-semibold mb-4">
        Comments
      </h2>

      {/* Add Comment */}
      {user && (
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={newComment}
            onChange={(e) =>
              setNewComment(e.target.value)
            }
            placeholder="Add a comment..."
            className="flex-1 bg-gray-800 px-4 py-2 rounded-full focus:outline-none"
          />
          <button
            onClick={handleAddComment}
            disabled={loading}
            className="bg-red-600 px-4 py-2 rounded-full"
          >
            Post
          </button>
        </div>
      )}

      {/* Comment List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment._id}
            className="flex justify-between bg-gray-900 p-4 rounded-lg"
          >
            <div>
              <p className="font-semibold">
                {comment.owner?.username}
              </p>
              <p className="text-gray-300 text-sm mt-1">
                {comment.content}
              </p>
            </div>

            {user?._id === comment.owner?._id && (
              <button
                onClick={() =>
                  handleDelete(comment._id)
                }
                className="text-red-400 text-sm"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};

export default CommentSection;