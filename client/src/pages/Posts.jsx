// All Posts //
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/Posts.css";
import clapIcon from "../images/clap.png"; 

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [clappedPosts, setClappedPosts] = useState([]); 
  const [shakePost, setShakePost] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postsRes = await axios.get("http://localhost:5000/api/posts");

        let savedPosts = [];
        if (user) {
          const savedRes = await axios.get(
            `http://localhost:5000/api/posts/saved/${user._id}`
          );
          savedPosts = savedRes.data.map((p) => p._id);
        }

        const updatedPosts = postsRes.data.map((post) => ({
          ...post,
          isSaved: savedPosts.includes(post._id),
        }));

        setPosts(updatedPosts);
      } catch (err) {
        console.error("❌ Error loading posts:", err);
      }
    };

    fetchData();
  }, []);

  const toggleSave = async (postId, isSaved) => {
    if (!user) {
      alert("Please log in to save posts.");
      return;
    }

    try {
      const url = isSaved
        ? `http://localhost:5000/api/posts/${postId}/unsave`
        : `http://localhost:5000/api/posts/${postId}/save`;

      await axios.post(url, { userId: user._id });

      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, isSaved: !isSaved } : p
        )
      );
    } catch (err) {
      console.error("❌ Save toggle error:", err);
    }
  };

  const handleClapToggle = async (postId) => {
    try {
      let url;
      if (clappedPosts.includes(postId)) {
        url = `http://localhost:5000/api/posts/${postId}/unclap`;
        setClappedPosts((prev) => prev.filter((id) => id !== postId));
      } else {
        url = `http://localhost:5000/api/posts/${postId}/clap`;
        setClappedPosts((prev) => [...prev, postId]);

        setShakePost(postId);
        setTimeout(() => setShakePost(null), 400);
      }

      const res = await axios.post(url);

      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, clapCount: res.data.clapCount } : p
        )
      );
    } catch (err) {
      console.error("❌ Error toggling clap:", err);
    }
  };

  const stopPropagation = (e) => e.stopPropagation();

  return (
    <div className="posts-page">
      <div className="posts-container">
        <h2 className="posts-heading">
          <span className="highlight">All Posts</span>
        </h2>

        {posts.length === 0 ? (
          <p className="no-posts">No posts yet.</p>
        ) : (
          <div className="posts-grid">
            {posts.map((post) => (
              <div
                className="post-card"
                key={post._id}
                onClick={() => navigate(`/post/${post._id}`)}
              >
                <div className="post-content-box">
                  <h3 className="post-title">{post.title}</h3>
                  <p className="post-author">
                    <strong>Author:</strong> {post.author}
                  </p>

                  {post.excerpt && (
                    <p className="post-excerpt">{post.excerpt}</p>
                  )}

                  <div className="post-buttons">

                    {user && (
                      <button
                        className="save-btn"
                        onClick={(e) => {
                          stopPropagation(e);
                          toggleSave(post._id, post.isSaved);
                        }}
                      >
                        {post.isSaved ? (
                          <svg
                            width="24"
                            height="24"
                            fill="#ff4500"
                            viewBox="0 0 24 24"
                          >
                            <path d="M6 2C4.9 2 4 2.9 4 4V21L12 17L20 21V4C20 2.9 19.1 2 18 2H6Z" />
                          </svg>
                        ) : (
                          <svg
                            width="24"
                            height="24"
                            fill="none"
                            stroke="#333"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path d="M6 2C4.9 2 4 2.9 4 4V21L12 17L20 21V4C20 2.9 19.1 2 18 2H6Z" />
                          </svg>
                        )}
                      </button>
                    )}

                    <button
                      className="clap-btn"
                      onClick={(e) => {
                        stopPropagation(e);
                        handleClapToggle(post._id);
                      }}
                    >
                      <img 
                        src={clapIcon} 
                        alt="clap" 
                        className={`clap-icon ${shakePost === post._id ? "shake" : ""}`}
                      />
                      {post.clapCount || 0}
                    </button>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Posts;
