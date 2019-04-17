const express = require('extra-express');
const net = require('extra-net');
const http = require('http');
const path = require('path');
const table = require('./src/table');



const E = process.env;
const IP = net.address().address;
const PORT = E['PORT']||'8000';
const ADDRESS = IP+':'+PORT;
const ASSETS = path.join(__dirname, 'assets');
const app = express();
const server = http.createServer(app);



app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use((req, res, next) => {
  Object.assign(req.body, req.query);
  var {ip, method, url, body} = req;
  if(method!=='GET') console.log(ip, method, url, body);
  next();
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
  table.create(id);
  res.json(table.replace(id, row));
});
app.get('/table/:id', (req, res) => {
  var {id} = req.params, {sql} = req.body;
  res.json(table.select(id, sql));
});

app.use(express.static(ASSETS, {extensions: ['html']}));
app.use((err, req, res, next) => {
  var {statusCode, message} = err;
  console.error(err, err.stack);
  res.status(statusCode||500).json(err.json||{statusCode, message});
});
server.listen(PORT, () => {
  console.log('QUERY running at '+ADDRESS);
});
