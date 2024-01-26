// CommentSection.jsx

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const CommentSection = ({ postId, userId, isLoggedIn }) => {
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState({});
  const [newCommentText, setNewCommentText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchComments();
    fetchUsers();
  }, [postId]);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/comments/post/${postId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`); // Fixed syntax error here
      }
      const data = await response.json();
      const usersMap = data.reduce((acc, user) => {
        acc[user.id] = user.username;
        return acc;
      }, {});
      setUsers(usersMap);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment_text: newCommentText,
          user_id: userId,
          post_id: postId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const newComment = await response.json();
      setComments([...comments, newComment]);
      setNewCommentText("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className="comment-section">
      {isLoggedIn ? (
        <form onSubmit={handleCommentSubmit} className="comment-form">
          <textarea
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)} // Fixed syntax error here
            placeholder="Write a comment..."
            required
            className="comment-textarea bg-transparent w-full text-black focus:outline-none"
          />
          <button type="submit" className="comment-submit mt-2 font-bold">
            Post
          </button>
        </form>
      ) : (
        <p>Please log in to comment.</p>
      )}
      {isLoading ? (
        <p>Loading comments...</p>
      ) : comments.length > 0 ? (
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>
              <strong>{users[comment.user_id]}:</strong> {comment.comment_text}
              {comment.user_id === userId && (
                <button onClick={() => handleDeleteComment(comment.id)}>
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="comment-no-comments">No comments yet.</p>
      )}
    </div>
  );
};

CommentSection.propTypes = {
  postId: PropTypes.number.isRequired,
  userId: PropTypes.number,
  isLoggedIn: PropTypes.bool.isRequired,
};

export default CommentSection;
