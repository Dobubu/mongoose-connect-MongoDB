const http = require('http');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/postDB')
  .then(() => console.log('db connect success'))
  .catch(e => console.log(e));

const PostsSchema = new mongoose.Schema({
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
});
const Post = mongoose.model('Post', PostsSchema);

const requestListener = (req, res) => {
  res.writeHead(200, {'Content-type': 'text/plain'});
  res.write('hello');
  res.end();
};

const server = http.createServer(requestListener);
server.listen(3001);