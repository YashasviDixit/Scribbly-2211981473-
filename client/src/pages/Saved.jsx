import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Saved = () => {
  const [posts, setPosts] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    axios
      .get(`http://localhost:5000/api/posts/saved/${user._id}`)
      .then((res) => setPosts(res.data))
      .catch((err) => console.error("❌ Error fetching saved posts:", err));
  }, []);

  return (
    <div style={{ padding: "30px" }}>

      
      {posts.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "60px" }}>
          <img src="https://cdn-icons-png.flaticon.com/512/7486/7486742.png" alt="empty" style={{ width: "160px", opacity: 0.9 }}/>
          <h3 style={{ marginTop: "20px", fontSize: "26px", color: "#222" }}>
            Nothing Saved Yet
          </h3>
          <p style={{ color: "#555", marginTop: "8px", fontSize: "15px" }}>
            Save posts you find interesting and access them anytime.
          </p>

          <button
            onClick={() => navigate("/posts")}
            style={{
              marginTop: "20px",
              padding: "12px 22px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "15px",
              transition: "0.2s",
            }}
          >
            Explore Posts →
          </button>
        </div>
      ) : (
        
        <div className="posts-grid">
          {posts.map((post) => (
            <div
              key={post._id}
              className="post-card"
              onClick={() => navigate(`/post/${post._id}`)}
              style={{ cursor: "pointer" }}
            >
              <h3>{post.title}</h3>
              <p>
                <strong>Author:</strong> {post.author}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Saved;
