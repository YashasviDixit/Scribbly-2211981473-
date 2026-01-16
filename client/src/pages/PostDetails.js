// For Particular Post //
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/Details.css";

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/posts/${id}`)
      .then((res) => setPost(res.data))
      .catch((err) => console.error("❌ Error fetching post:", err));
  }, [id]);

  if (!post) return <p>Loading...</p>;

  return (
    <div className="post-details-page">
      
      <h2 className="post-title">{post.title}</h2>

      <p className="post-author">
        <strong>Author:</strong> {post.author}
      </p>

      {post.image && (
        <img
          src={`http://localhost:5000/uploads/${post.image}`}
          alt="post"
          className="post-image"
        />
      )}

      
      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      ></div>

      
      <div className="top-buttons">
        <button onClick={() => navigate("/posts")} className="back-btn">
          ← Back to All Posts
        </button>
      </div>

    </div>
  );
};

export default PostDetails;
