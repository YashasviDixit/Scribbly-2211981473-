const express = require("express");
const router = express.Router();
const multer = require("multer");
const Post = require("../models/Post");
const User = require("../models/User");

//  Multer Setup //
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

//  GET all posts //
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

//  CREATE a new post //
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!title || !content || !author) {
      return res
        .status(400)
        .json({ message: "Title, content, and author are required" });
    }

    const newPost = new Post({ title, content, author, image });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

//  DELETE a post //
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const authorName = req.query.user;
    if (authorName && post.author !== authorName) {
      return res
        .status(403)
        .json({ message: "You can only delete your own posts" });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

//  SAVE post //
router.post("/:id/save", async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.savedPosts.includes(req.params.id)) {
      user.savedPosts.push(req.params.id);
      await user.save();
    }

    res.json({ message: "Post saved" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

//  UNSAVE post //
router.post("/:id/unsave", async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.savedPosts = user.savedPosts.filter(
      (postId) => postId.toString() !== req.params.id.toString()
    );

    await user.save();
    res.json({ message: "Post unsaved" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

//  GET saved posts for a user //
router.get("/saved/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("savedPosts");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.savedPosts);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

//   CLAP a post //
router.post("/:id/clap", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    post.clapCount = (post.clapCount || 0) + 1; 
    await post.save();

    res.json({ clapCount: post.clapCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

//   UNCLAP a post //
router.post("/:id/unclap", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    post.clapCount = Math.max((post.clapCount || 0) - 1, 0); 
    await post.save();

    res.json({ clapCount: post.clapCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

//  GET single post //
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
