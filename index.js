const Database = require('better-sqlite3');
const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');


const E = process.env;
const PORT = E['PORT']||'1992';
const app = express();


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


const server = http.createServer(app);
server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server.listen(PORT, () => {
  console.log('QUERY started on port '+PORT);
});
