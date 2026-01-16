const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String },
    author: { type: String, required: true },
    image: { type: String },
    clapCount: { type: Number, default: 0 }  
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
