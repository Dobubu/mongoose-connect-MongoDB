const http = require('http');

require('./connections');

const routes = require('./routes/posts');

const requestListener = (req, res) => {
  routes(req, res);
};

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3001);