const mongoose = require('mongoose');

const PostsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'name field required']
    },
    image: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      required: [true, 'content field required']
    },
    likes: {
      type: Number,
      default: 0
    },
    comments: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    type: {
      type: String,
      enum:['group', 'person'],
      required: [true, 'type field required']
    },
    tags: {
      type: [String],
      required: [true, 'tags field required']
    }
  },
  {
    versionKey: false,
  }
);

const Posts = mongoose.model('Post', PostsSchema);

module.exports = Posts;