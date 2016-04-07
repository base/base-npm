'use strict';

var npm = require('./');
var Base = require('base');
var app = new Base();
app.use(npm());

app.npm.saveDev(['isobject', 'requires-regex'], function(err) {
  if (err) throw err;
});
