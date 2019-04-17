const Database = require('better-sqlite3');



const DBFILE = 'status.db';
const SQLTYPE = {
  'boolean': 'INTEGER',
  'number': 'REAL',
  'string': 'TEXT',
};
const RKEYWORD = /^offset|limit|order|group|where/i;
const db = new Database(DBFILE);



function type(val) {
  return SQLTYPE[typeof val]||null;
}

function rowMap(row) {
  var out = {};
  for(var k in row)
    if(type(row[k])) out[k] = row[k];
  return out;
};

function queryMap(query) {
  var q = query||'';
  return RKEYWORD.test(q)? q:'WHERE '+q;
}

function dropTable(table) {
  var sql = `DROP TABLE IF EXISTS "${table}"`;
  return db.prepare(sql).run();
}

function createTable(table) {
  var sql = `CREATE TABLE IF NOT EXISTS "${table}" ("id" TEXT PRIMARY KEY)`;
  return db.prepare(sql).run();
}

function deleteRows(table, query) {
  var expr = queryMap(query);
  var sql = `DELETE FROM "${table}" ${expr}`;
  return db.prepare(sql).run();
}

function replaceRow(table, row) {
  var keys = Object.keys(row);
  var fields = keys.map(k => `"${k}"`).join(', ');
  var values = keys.map(k => `@${k}`).join(', ');
  var sql = `REPLACE INTO "${table}" (${fields}) VALUES (${values})`;
  return db.prepare(sql).run(row);
}

function replaceRowAuto(table, row) {
  var pragma = db.pragma(`table_info("${table}")`);
  var columns = pragma.map(r => r.name.toLowerCase());
  var row = rowMap(row);
  for(var k in row) {
    if(columns.includes(k.toLowerCase())) continue;
    db.prepare(`ALTER TABLE "${table}" ADD "${k}" ${type(row[k])}`).run();
  }
  var old = db.prepare(`SELECT * FROM "${table}" WHERE "id"=@id`).get(row)||{};
  return replaceRow(table, Object.assign(old, row));
}

function selectRows(table, query) {
  var expr = queryMap(query);
  var sql = `SELECT * FROM "${table}" ${expr}`;
  return db.prepare(sql).all();
}
exports.drop = dropTable;
exports.create = createTable;
exports.delete = deleteRows;
exports.replace = replaceRowAuto;
exports.select = selectRows;
