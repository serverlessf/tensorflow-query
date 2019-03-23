const Database = require('better-sqlite3');
const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');



const E = process.env;
const PORT = E['PORT']||'8080';
const app = express();
const db = new Database('query.db');



app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.get('/:org', (req, res) => {
  var {org} = req.params, {sql} = req.body;
  var s = db.prepare(sql||`SELECT * FROM "${org}"`);
  res.json(s.all());
});
app.get('/:org/:service', (req, res) => {
  var {org, service} = req.params;
  var s = db.prepare(`SELECT * FROM "${org}" WHERE "id"=?`);
  res.send(s.get(service));
});
app.post('/:org', (req, res) => {
  var {org} = req.params;
  var s = db.prepare(`CREATE TABLE IF NOT EXISTS "${org}" ("id" PRIMARY KEY TEXT, "type" TEXT)`);
  res.json(s.run());
});
app.post('/:org/:service', (req, res) => {
  var {org, service} = req.params;
  res.json(db.pragma(`table_info("${org}")`));
});



const server = http.createServer(app);
server.on('clientError', (err, soc) => {
  soc.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server.listen(PORT, () => {
  console.log('QUERY started on port '+PORT);
});
