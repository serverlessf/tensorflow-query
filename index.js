const Database = require('better-sqlite3');
const express = require('extra-express');
const http = require('http');
const path = require('path');



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

app.get('/:org', (req, res) => {
  var {org} = req.params, {sql} = req.body;
  var s = db.prepare(sql||`SELECT * FROM "${org}"`);
  res.json(s.all());
});
app.get('/:org/:id', (req, res) => {
  var {org, id} = req.params;
  var s = db.prepare(`SELECT * FROM "${org}" WHERE "id"=?`);
  res.send(s.get(id));
});
app.post('/:org', (req, res) => {
  var {org} = req.params;
  var s = db.prepare(`CREATE TABLE IF NOT EXISTS "${org}" ("id" TEXT PRIMARY KEY)`);
  res.json(s.run());
});
app.post('/:org/:id', (req, res) => {
  var {org, id} = req.params, row = Object.assign({}, sqlFilter(req.body), {id});
  res.json(dbReplaceAny(db, org, row));
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
