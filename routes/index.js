const Posts = require('../model/post');

const headers = require('../service/headers');
const handleSuccess = require('../service/handleSuccess');
const handleError = require('../service/handleError');

const routes = async (req, res) => {
  const { url, method } = req;
  const data = await Posts.find();

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

        const newPost = await Posts.create({
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
        
        const updatePostRes = await Posts.findByIdAndUpdate(id, {
          content: updateData.content,
        });

        handleSuccess(res, updatePostRes);
      } catch (e) {
        handleError(res, e);
      }
    });
  } else if(url === '/posts' && method === 'DELETE') {
    await Posts.deleteMany({});

    handleSuccess(res, []);
  } else if(url.startsWith('/posts/') && method === 'DELETE') {
    req.on('end', async () => {
      try {
        const id = req.url.split('/').pop();
        const isExist = data.find(o => o.id === id);
  
        if(!isExist) throw new Error('post not exist.')

        await Posts.findByIdAndDelete(id);

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

module.exports = routes;