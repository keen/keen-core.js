var test = require('tape');
var App = require('../lib/index');

test('Constructor', function(t) {
  var app = new App();
  t.equal(app instanceof App, true,
    'Instantiation should return a new instance of the app');
  t.end();
});
