const Posts = require('../model/posts');

const httpControllers = require('../controllers/cors');
const postsControllers = require('../controllers/posts');

const routes = async (req, res) => {
  const { url, method } = req;
  const postList = await Posts.find();

  let body = '';
  req.on('data', chunk => {
    body += chunk
  });

  if(url === '/posts' && method === 'GET') {
    postsControllers.fetchPost({ res, postList });
  } else if(url === '/posts' && method === 'POST') {
    req.on('end', () => {
      postsControllers.createPost({ body, res });
    });
  } else if(url.startsWith('/posts/') && method === 'PATCH') {
    req.on('end', () => {
      postsControllers.updatePostByID({ req, res, body, postList });
    });
  } else if(url === '/posts' && method === 'DELETE') {
    postsControllers.deletePost(res);
  } else if(url.startsWith('/posts/') && method === 'DELETE') {
    req.on('end', async () => {
      postsControllers.deletePostByID({ req, res, postList });
    });
  } else if(method === 'OPTIONS') {
    httpControllers.cors(res);
  } else {
    httpControllers.pageNotFound(res);
  };;
};

module.exports = routes;