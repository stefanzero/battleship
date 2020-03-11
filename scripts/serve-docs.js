const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const open = require('open');
const createDemo = require('./create-demo');
const baseDirectory = path.resolve(__dirname, '../docs');

const port = 8081;

http.createServer(async function (request, response) {
  try {
    const requestUrl = url.parse(request.url);

    // need to use path.normalize so people can't access directories underneath baseDirectory
    const fsPath = `${baseDirectory}${path.normalize(requestUrl.pathname)}`;
    if (/demo/i.test(request.url)) {
      await createDemo();
    }

    const fileStream = fs.createReadStream(fsPath);
    fileStream.pipe(response);
    fileStream.on('open', function() {
      response.writeHead(200);
    })
    fileStream.on('error',function(e) {
      response.writeHead(404);    // assume the file doesn't exist
      response.end();
    })
  } catch(e) {
    response.writeHead(500);
    response.end();     // end the response so browsers don't hang
    console.log(e.stack);
  }
}).listen(port);

console.log(`listening on port ${port}`);

setTimeout(() => {
  open('http://localhost:8081/index.html')
}, 2000);