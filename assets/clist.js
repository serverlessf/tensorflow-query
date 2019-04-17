const $p = document.querySelector('p');
const $scope = document.querySelector('#scope');
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
  var scope = $scope.value||'default', data = {sql: $sql.value};
  var cs = await m.request({method: 'GET', url: `/table/${scope}.container`, data});
  m.render($tbody, cs.map(c => m('tr', [
    m('td', m('a', {href: `http://${c.deviceaddr}/cdata.html?container=${c.id}&from=${c.image}`}, c.id)),
    m('td', m('a', {href: `http://${c.deviceaddr}`}, c.device)),
    m('td', c.image), m('td', c.status), m('td', (c.publish||'').split(';').map(p => (
    m('tag', p.replace('=', '->'))
  )))])));
}



options = onReady();
request(options);
setInterval(() => request(options).then(() => {
  m.render($p, null);
}, err => m.render($p, err.message)), 1000);
