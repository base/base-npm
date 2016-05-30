'use strict';

require('mocha');
var assert = require('assert');
var path = require('path');
var Base = require('base');
var questions = require('base-questions');
var Pkg = require('pkg-store');
var del = require('delete');
var npm = require('./');
var app, pkg;

var fixtures = path.resolve.bind(path, __dirname, 'fixtures');
var cwd = process.cwd();

describe('base-npm', function() {
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
      pkg.set(require(fixtures('tmpl.json')));
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

  it('should ask to install the given package', function(cb) {
    this.timeout(20000);
    app.npm.askInstall(['helper-example'], {noprompt: true}, function(err) {
      if (err) return cb(err);
      assert(pkg.has('devDependencies.helper-example'));
      cb();
    });
  });
});
