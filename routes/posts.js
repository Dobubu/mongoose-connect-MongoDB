const Post = require('../model/posts');

const httpControllers = require('../controllers/cors');
const postsControllers = require('../controllers/posts');

const routes = async (req, res) => {
  const { url, method } = req;

  let body = '';
  req.on('data', chunk => {
    body += chunk
  });

  if(url === '/posts' && method === 'GET') {
    postsControllers.fetchPosts(res);
  } else if(url === '/posts' && method === 'POST') {
    req.on('end', () => {
      postsControllers.createPost({ body, res });
    });
  } else if(url.startsWith('/posts/') && method === 'PATCH') {
    req.on('end', () => {
      postsControllers.updatePostByID({ req, res, body });
    });
  } else if(url === '/posts' && method === 'DELETE') {
    postsControllers.deletePosts(res);
  } else if(url.startsWith('/posts/') && method === 'DELETE') {
    req.on('end', async () => {
      postsControllers.deletePostByID({ req, res });
    });
  } else if(method === 'OPTIONS') {
    httpControllers.cors(res);
  } else {
    httpControllers.pageNotFound(res);
  };;
};

module.exports = routes;