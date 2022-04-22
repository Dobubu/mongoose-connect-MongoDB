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

const headers = {
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
  'Content-Type': 'application/json'
};

const requestListener = async (req, res) => {
  const { url, method } = req;
  const data = await Post.find();

  if(url === '/posts' && method === 'GET') {
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      'status': 'success',
      data
    }));
    res.end();
  } else if(method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
  } else {
    res.writeHead(404, headers);
    res.write(JSON.stringify({
      'status': 'false',
      'message': 'page not found!'
    }));
    res.end();
  };;
};

const server = http.createServer(requestListener);
server.listen(3001);