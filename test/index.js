var test = require('tape');
var App = require('../lib/index');

test('Constructor', function(t) {
  var app = new App();
  t.equal(app instanceof App, true,
    'Instantiation should return a new instance of the app');
  t.end();
});

test('.masterKey()', function(t){
  var app = new App({
    masterKey: '123'
  });
  t.equal(app.masterKey(), '123',
    'Should get the correct masterKey value');
  app.masterKey('456');
  t.equal(app.masterKey(), '456',
    'Should set the correct masterKey value');
  t.end();
});

test('.projectId()', function(t){
  var app = new App({
    projectId: '123'
  });
  t.equal(app.projectId(), '123',
    'Should get the correct projectId value');
  app.projectId('456');
  t.equal(app.projectId(), '456',
    'Should set the correct projectId value');
  t.end();
});
