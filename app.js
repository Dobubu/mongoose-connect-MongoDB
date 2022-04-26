const http = require('http');

require('./connections');

const routes = require('./routes');

const requestListener = (req, res) => {
  routes(req, res);
};

const server = http.createServer(requestListener);
server.listen(3001);