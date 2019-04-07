const Database = require('better-sqlite3');
const express = require('express');
const http = require('http');



const E = process.env;
const PORT = E['PORT']||'9000';
const SQLTYPE = {
  'boolean': 'INTEGER',
  'number': 'REAL',
  'string': 'TEXT',
};

const app = express();
const db = new Database('main.db');





function sqlType(val) {
  return SQLTYPE[typeof val]||null;
}

function sqlFilter(row, out={}) {
  for(var k in row)
    if(sqlType(row[k])) out[k] = row[k];
  return out;
};

function sqlReplace(table, row) {
  var keys = Object.keys(row);
  var fields = keys.map(k => `"${k}"`).join(', ');
  var values = keys.map(k => `@${k}`).join(', ');
  return `REPLACE INTO "${table}" (${fields}) VALUES (${values})`;
}

function dbReplace(db, table, row) {
  return db.prepare(sqlReplace(table, row)).run(row);
}

function dbReplaceAny(db, table, row) {
  var old = db.prepare(`SELECT * FROM "${table}" WHERE "id"=@id`).get(row)||{};
  var pragma = db.pragma(`table_info("${table}")`);
  var keys = pragma.map(r => r.name.toLowerCase());
  for(var k in row) {
    if(keys.includes(k.toLowerCase())) continue;
    db.prepare(`ALTER TABLE "${table}" ADD "${k}" ${sqlType(row[k])}`).run();
  }
  return dbReplace(db, table, Object.assign(old, row));
}


app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use((req, res, next) => {
  Object.assign(req.body, req.query);
  if(req.method!=='GET') console.log(req.ip, req.method, req.url, req.body);
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



const server = http.createServer(app);
server.on('clientError', (err, soc) => {
  soc.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server.listen(PORT, () => {
  console.log('QUERY started on port '+PORT);
});
