'use strict';

var npm = require('./');
var Base = require('base');
var app = new Base();
app.use(npm());

// app.npm.save(function(err) {
//   if (err) throw err;
// });

app.npm.latest(function(err) {
  if (err) throw err;
});
