import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      axios
        .get("http://localhost:5000/api/posts")
        .then((res) => {
          if (Array.isArray(res.data)) {
            const userPosts = res.data.filter(
              (post) => post.author === parsedUser.name
            );
            setPosts(userPosts);
          } else {
            setPosts([]);
          }
        })
        .catch((err) => {
          console.error("❌ Error fetching posts:", err);
          setPosts([]);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/posts/${postId}?user=${user.name}`
      );
      setPosts(posts.filter((post) => post._id !== postId));
      alert("✅ Post deleted successfully");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error deleting post");
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>Please login first.</p>;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Welcome, {user.name.split(" ")[0]}</h1>
        <p><strong>Email:</strong> {user.email}</p>
      </div>

      <div className="profile-posts">
        <h2>Your Posts</h2>
        {posts.length === 0 ? (
          <p className="no-posts">No posts yet.</p>
        ) : (
          <div className="posts-grid">
            {posts.map((post) => (
              <div key={post._id} className="post-card">
                <h3>{post.title}</h3>
                <div
                  className="post-content"
                  dangerouslySetInnerHTML={{
                    __html:
                      post.content && post.content.length > 150
                        ? `${post.content.slice(0, 150)}...`
                        : post.content,
                  }}
                ></div>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(post._id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
