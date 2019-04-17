const express = require('extra-express');
const http = require('http');
const path = require('path');
const table = require('./src/table');



const E = process.env;
const PORT = E['PORT']||'8000';
const ASSETS = path.join(__dirname, 'assets');
const app = express();
const server = http.createServer(app);



app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use((req, res, next) => {
  Object.assign(req.body, req.query);
  var {ip, method, url, body} = req;
  if(method!=='GET') console.log(p, method, url, body);
  next();
});

app.delete('/table/:id', (req, res) => {
  var {id} = req.params;
  res.json(table.delete(id));
});
app.post('/table', (req, res) => {
  var {id} = req.body;
  res.json(table.create(id));
});
app.delete('/table/:id', (req, res) => {
  var {id} = req.params, {sql} = req.body;
  res.json(table.delete(id, sql));
});
app.post('/table/:id', (req, res) => {
  var {id} = req.params, row = req.body;
  res.json(table.replace(id, row));
});
app.get('/table/:id', (req, res) => {
  var {id} = req.params, {sql} = req.body;
  res.json(table.select(id, sql));
});

app.use(express.static(ASSETS, {extensions: ['html']}));
app.use((err, req, res, next) => {
  console.error(err, err.stack);
  res.status(err.statusCode||500).send(err.json||err);
});
server.on('clientError', (err, soc) => {
  soc.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server.listen(PORT, () => {
  console.log('QUERY started on port '+PORT);
});
