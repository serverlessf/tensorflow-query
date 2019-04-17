const status = require('./src/status');


function createAndDrop() {
  console.log('createAndDrop()');
  console.log(status.create('temp'));
  console.log(status.drop('temp'));
}

function replaceAndDelete() {
  console.log('replaceAndDelete()');
  console.log(status.create('temp'));
  console.log(status.replace('temp', {id: 'a'}));
  console.log(status.replace('temp', {id: 'b', a: 1}));
  console.log(status.replace('temp', {id: 'a', a: 2, b: 1}));
  console.log(status.delete('temp', `id='a'`));
  console.log(status.delete('temp', `a>1 and b<2`));
  console.log(status.drop('temp'));
}

function select() {
  console.log('select()');
  console.log(status.create('temp'));
  console.log(status.replace('temp', {id: 'a'}));
  console.log(status.replace('temp', {id: 'b', a: 1}));
  console.log(status.replace('temp', {id: 'a', a: 2, b: 1}));
  console.log(status.select('temp', `id='a'`));
  console.log(status.select('temp', `a>=1`));
  console.log(status.drop('temp'));
}
createAndDrop();
replaceAndDelete();
select();
