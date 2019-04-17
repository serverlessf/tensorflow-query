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
  var ds = await m.request({method: 'GET', url: `/table/${scope}.device`, data});
  m.render($tbody, ds.map(d => m('tr', [
    m('td', m('a', {href: `http://${d.address}`}, d.id)),
    m('td', d.latitude), m('td', d.longitude),
    m('td', d.location), m('td', d.city)])));
}



options = onReady();
request(options);
setInterval(() => request(options).then(() => {
  m.render($p, null);
}, err => m.render($p, err.message)), 1000);
