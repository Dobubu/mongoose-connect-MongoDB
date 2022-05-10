const Post = require('../model/posts');

const handleSuccess = require('../service/handleSuccess');
const handleError = require('../service/handleError');

const posts = {
  fetchPost({res, postList:list }) {
    handleSuccess(res, list);
  },
  async createPost({ body, res }) {
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
  },
  async updatePostByID({ req, res, body, postList:list }) {
    try {
      const id = req.url.split('/').pop();
      const isExist = list.find(o => o.id === id);
      if(!isExist) throw new Error('post not exist.')

      const updateData = JSON.parse(body);
      if(!updateData.content) throw new Error('content field required.');

      let payload = { 
        content: updateData.content,
      };
      if(updateData.name) {
        payload = { ...payload, name: updateData.name };
      }
      if(updateData.type) {
        if(updateData.type === "group" || updateData.type === "person") {
          payload = { ...payload, type: updateData.type };
        } else {
          throw new Error('type is invalid, valid values include [group, person].');
        }
      }
      if(updateData.tags) {
        if(!updateData.tags.length) throw new Error("tags can't empty.");
        payload = { ...payload, tags: updateData.tags };
      }

      const updatePostRes = await Post.findByIdAndUpdate(id, payload, { new: true });

      handleSuccess(res, updatePostRes);
    } catch (e) {
      handleError(res, e);
    }
  },
  async deletePost(res) {
    await Post.deleteMany({});

    handleSuccess(res, []);
  },
  async deletePostByID({ req, res, postList:list }) {
    try {
      const id = req.url.split('/').pop();
      const isExist = list.find(o => o.id === id);

      if(!isExist) throw new Error('post not exist.')

      await Post.findByIdAndDelete(id);

      handleSuccess(res, 'delete success');
    } catch (e) {
      handleError(res, e);
    };
  }
};

module.exports = posts;