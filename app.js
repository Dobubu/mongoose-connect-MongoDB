const http = require('http');
const mongoose = require('mongoose');

const headers = require('./service/headers');
const handleSuccess = require('./service/handleSuccess');
const handleError = require('./service/handleError');

mongoose.connect('mongodb://localhost:27017/postDB')
  .then(() => console.log('db connect success'))
  .catch(e => console.log(e));

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
const Post = mongoose.model('Post', PostsSchema);

const requestListener = async (req, res) => {
  const { url, method } = req;
  const data = await Post.find();

  let body = '';
  req.on('data', chunk => {
    body += chunk
  });

  if(url === '/posts' && method === 'GET') {
    handleSuccess(res, data);
  } else if(url === '/posts' && method === 'POST') {
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const { name, image, content, type, tags } = data;

        const newPost = await Post.create({
          name,
          image,
          content,
          type,
          tags
        });

        handleSuccess(res, newPost);
      } catch (e) {
        handleError(res, e);
      };
    });
  } else if(url.startsWith('/posts/') && method === 'PATCH') {
    req.on('end', async () => {
      try {
        const id = req.url.split('/').pop();
        const isExist = data.find(o => o.id === id);
  
        if(!isExist) throw new Error('post not exist.')

        const updateData = JSON.parse(body);
        if(!updateData.content) throw new Error('content field required');
        
        const updatePostRes = await Post.findByIdAndUpdate(id, {
          content: updateData.content,
        });

        handleSuccess(res, updatePostRes);
      } catch (e) {
        handleError(res, e);
      }
    });
  } else if(url === '/posts' && method === 'DELETE') {
    await Post.deleteMany({});

    handleSuccess(res, []);
  } else if(url.startsWith('/posts/') && method === 'DELETE') {
    req.on('end', async () => {
      try {
        const id = req.url.split('/').pop();
        const isExist = data.find(o => o.id === id);
  
        if(!isExist) throw new Error('post not exist.')

        await Post.findByIdAndDelete(id);

        handleSuccess(res, 'delete success');
      } catch (e) {
        handleError(res, e);
      };
    });
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