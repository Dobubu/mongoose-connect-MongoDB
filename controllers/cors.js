const headers = require('../service/headers');

const http = {
  cors(res) {
    res.writeHead(200, headers);
    res.end();
  },
  pageNotFound(res) {
    res.writeHead(404, headers);
    res.write(JSON.stringify({
      'status': 'false',
      'message': 'page not found!'
    }));
    res.end();
  }
};

module.exports = http;