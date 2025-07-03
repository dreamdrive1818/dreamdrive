import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import "./CommentShow.css";

const CommentShow = ({ blogId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      const snapshot = await getDocs(collection(db, `_blogs/${blogId}/comments`));
      const data = snapshot.docs
        .map((doc) => doc.data())
        .filter((comment) => comment.approved === true); // ✅ only approved
      setComments(data);
    } catch (err) {
      console.error("Error loading comments:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (blogId) {
      fetchComments();
    }
  }, [blogId]);

  if (loading) return <div className="comment-section"><p className="comment-loading">Loading comments...</p></div>;
  if (comments.length === 0) return <p className="comment-none">No comments yet.</p>;

  return (
    <div className="comment-section">
      <h3 className="comment-title">Comments</h3>
      {comments.map((comment, index) => (
        <div className="comment-box" key={index}>
          <p className="comment-text">“{comment.comment}”</p>
          <p className="comment-meta">— {comment.name}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentShow;
