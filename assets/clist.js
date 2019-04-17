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

// NOTE: c.device is device id or address?
async function request(o) {
  var table = $table.value, data = {sql: $sql.value};
  var cs = await m.request({method: 'GET', url: `/table/${table}.container`, data});
  m.render($tbody, cs.map(c => m('tr', [
    m('td', m('a', {href: `http://${c.device}`}, c.device)),
    m('td', m('a', {href: `http://${c.device}/cdata.html?container=${c.id}&from=${c.image}`}, c.id)),
    m('td', c.image), m('td', c.message), m('td', Object.keys(c.publish||{}).map(k => (
    m('tag', `${k}->${c.publish[k]}`)
  )))])));
}



options = onReady();
request(options);
setInterval(() => request(options).then(() => {
  m.render($p, null);
}, err => m.render($p, err.message)), 1000);
