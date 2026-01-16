import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/CreatePost.css";


const CreatePost = () => {
  const [form, setForm] = useState({ title: "", content: "" });
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(null);
  const editorRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    else {
      alert("Please login to create a post.");
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => setImage(e.target.files[0]);

  const applyCommand = (cmd, value = null) => {
    document.execCommand(cmd, false, value);
    setForm({ ...form, content: editorRef.current.innerHTML });
  };

  const wrapSelectionWith = (style) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    if (range.collapsed) return; 

    const span = document.createElement("span");
    span.style = style;

    try {
      range.surroundContents(span);
    } catch (err) {
      document.execCommand("styleWithCSS", false, true);
      document.execCommand("foreColor", false, "inherit");
      document.execCommand("fontSize", false, "3");
    }

    setForm({ ...form, content: editorRef.current.innerHTML });
  };

  const addHeading = () =>
    wrapSelectionWith("font-size: 24px; font-weight: bold;");

  const addLink = () => {
    const url = prompt("Enter URL:");
    if (!url) return;

    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    if (range.collapsed) {
      alert("Please select text to link");
      return;
    }

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.target = "_blank";
    anchor.textContent = selection.toString();
    range.deleteContents();
    range.insertNode(anchor);

    setForm({ ...form, content: editorRef.current.innerHTML });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("content", form.content);
      formData.append("author", user.name);
      if (image) formData.append("image", image);

      await axios.post("http://localhost:5000/api/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Post created successfully!");
      navigate("/profile");
    } catch (err) {
      console.error("❌ Post error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Error creating post");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="create-post-container">
        <h2 className="posts-heading">
          <span className="highlight">Add Your Story</span>
        </h2>

        <form onSubmit={handleSubmit} className="create-post-form">
          <input
            className="post-input"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
          />

          {/* Rich Text Toolbar */}
          <div className="format-toolbar">
            <button type="button" onClick={() => applyCommand("bold")}>
              B
            </button>
            <button type="button" onClick={() => applyCommand("italic")}>
              I
            </button>
            <button type="button" onClick={addHeading}>
              T
            </button>
            <button type="button" onClick={addLink}>
              🔗
            </button>
          </div>

          <div
            className="post-textarea"
            contentEditable
            ref={editorRef}
            suppressContentEditableWarning={true}
            onInput={(e) =>
              setForm({ ...form, content: e.currentTarget.innerHTML })
            }
          ></div>

          <input type="file" accept="image/*" onChange={handleImageChange} />

          <button type="submit" className="submit-btn">
            Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
