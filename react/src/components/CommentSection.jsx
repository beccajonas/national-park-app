import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const CommentSection = ({ postId, userId }) => {
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5555/comments/post/${postId}`
      );
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

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5555/comments", {
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

  if (isLoading) {
    return <p>Loading comments...</p>;
  }

  return (
    <div className="comment-section">
      <h4>Comments</h4>
      <form onSubmit={handleCommentSubmit}>
        <textarea
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          placeholder="Write a comment..."
          required
        />
        <button type="submit">Post Comment</button>
      </form>
      {comments.length > 0 ? (
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>{comment.comment_text}</li>
          ))}
        </ul>
      ) : (
        <p>No comments yet.</p>
      )}
    </div>
  );
};

CommentSection.propTypes = {
  postId: PropTypes.number.isRequired,
  userId: PropTypes.number.isRequired,
};

export default CommentSection;
