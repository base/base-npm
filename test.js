'use strict';

require('mocha');
var assert = require('assert');
var path = require('path');
var Base = require('base');
var Pkg = require('pkg-store');
var del = require('delete');
var npm = require('./');
var app, pkg;

var fixtures = path.resolve.bind(path, __dirname, 'fixtures');
var cwd = process.cwd();

describe('base-npm', function() {
  this.timeout(20000);

  beforeEach(function() {
    process.chdir(fixtures());
    pkg = new Pkg(process.cwd());
    app = new Base();
    app.isApp = true;
    app.use(npm());
  });

  afterEach(function(cb) {
    del(fixtures('package.json'), function(err) {
      if (err) return cb(err);
      pkg.data = require(fixtures('tmpl.json'));
      pkg.save();
      cb();
    });
  });

  after(function() {
    process.chdir(cwd);
  });

  it('should export a function', function() {
    assert.equal(typeof npm, 'function');
  });

  it('should install globally and not save to package.json', function(cb) {
    app.npm.global('node-foo', function(err) {
      if (err) return cb(err);
      assert(!pkg.has('dependencies.node-foo'));
      assert(!pkg.has('devDependencies.node-foo'));
      cb();
    });
  });

  it('should install and not save to package.json', function(cb) {
    app.npm.install('isobject', function(err) {
      if (err) return cb(err);
      assert(!pkg.has('dependencies.isobject'));
      assert(!pkg.has('devDependencies.isobject'));
      cb();
    });
  });

  it('should install to dependencies in package.json', function(cb) {
    app.npm.save('isobject', function(err) {
      if (err) return cb(err);
      assert(pkg.has('dependencies.isobject'));
      cb();
    });
  });

  it('should install to devDependencies in package.json', function(cb) {
    app.npm.saveDev('isobject', function(err) {
      if (err) return cb(err);
      assert(pkg.has('devDependencies.isobject'));
      cb();
    });
  });

  it('should install the latest version of a package', function(cb) {
    var obj = new Pkg(process.cwd());
    obj.set('devDependencies', {isobject: '*'});
    obj.save();

    app.npm.latest(['isobject', '--save-dev'], function(err) {
      if (err) return cb(err);
      var pkg2Path = fixtures('package.json');
      var pkg2 = require(pkg2Path);
      assert(pkg2.devDependencies.hasOwnProperty('isobject'));
      assert.notEqual(pkg2.devDependencies.isobject, '*');

      del(pkg2, cb);
    });
  });

  it('should return `true` when module exists on npm', function(cb) {
    var name = 'base-npm';
    app.npm.exists(name, function(err, exists) {
      if (err) return cb(err);
      assert.equal(typeof exists, 'object');
      assert.equal(exists[name], true);
      cb();
    });
  });

  it('should return `false` when module does not exist on npm', function(cb) {
    var name = 'ljalskdjflkadsflkjalksdjlkasdflkjsdfljlklk';
    app.npm.exists(name, function(err, exists) {
      if (err) return cb(err);
      assert.equal(typeof exists, 'object');
      assert.equal(exists[name], false);
      cb();
    });
  });

  it('should return mixed results when some modules exist and some do not', function(cb) {
    var names = ['base-npm', 'ljalskdjflkadsflkjalksdjlkasdflkjsdfljlklk'];
    app.npm.exists(names, function(err, exists) {
      if (err) return cb(err);
      assert.equal(typeof exists, 'object');
      assert.equal(exists[names[0]], true);
      assert.equal(exists[names[1]], false);
      cb();
    });
  });
});
