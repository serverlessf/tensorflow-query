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
  console.log('request()', o);
  var scope = $scope.value||'default', data = {sql: $sql.value};
  var is = await m.request({method: 'GET', url: `/table/${scope}.image`, data});
  console.log(is);
  m.render($tbody, is.map(i => m('tr', [
    m('td', m('a', {href: `http://${i.deviceaddr}/idata.html?image=${i.id}&from=${i.from}`}, i.id)),
    m('td', m('a', {href: `http://${i.deviceaddr}`}, i.device)),
    m('td', i.version), m('td', i.from),
    m('td', (i.expose||[]).split(';').map(p => m('tag', p)))
  ])));
}



options = onReady();
request(options);
setInterval(() => request(options).then(() => {
  m.render($p, null);
}, err => m.render($p, err.message)), 1000);
