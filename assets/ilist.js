const $p = document.querySelector('p');
const $table = document.querySelector('#table');
const $sql = document.querySelector('#sql');
const $tbody = document.querySelector('tbody');
var options = {};



function searchParse(search) {
  var search = search.substring(1);
  return search? JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"')
  .replace(/&/g, '","').replace(/=/g,'":"') + '"}'):{};
}

function onReady() {
  var o = searchParse(location.search);
  console.log('onReady()', o);
  return o;
}

async function request(o) {
  console.log('request()', o);
  var table = $table.value||'default', data = {sql: $sql.value};
  var is = await m.request({method: 'GET', url: `/table/${table}.image`, data});
  m.render($tbody, is.map(i => m('tr', [
    m('td', m('a', {href: `http://${i.device}`}, i.device)),
    m('td', m('a', {href: `http://${i.device}/idata.html?image=${i.id}&from=${i.from}`}, i.id)),
    m('td', i.version), m('td', i.from),
    m('td', (i.expose||[]).map(p => m('tag', p)))
  ])));
}



options = onReady();
request(options);
setInterval(() => request(options).then(() => {
  m.render($p, null);
}, err => m.render($p, err.message)), 1000);
