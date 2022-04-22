const http = require('http');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/postDB')
  .then(() => console.log('db connect success'))
  .catch(e => console.log(e));

const requestListener = (req, res) => {
  res.writeHead(200, {'Content-type': 'text/plain'});
  res.write('hello');
  res.end();
};

const server = http.createServer(requestListener);
server.listen(3001);