'use strict';

require('mocha');
var assert = require('assert');
var Base = require('base');
var Pkg = require('pkg-store');
var npm = require('./');
var app, pkg;

describe('base-npm', function() {
  beforeEach(function() {
    pkg = new Pkg(process.cwd());
    app = new Base();
    app.use(npm());
  });

  afterEach(function() {
    pkg.save();
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
      pkg.del('dependencies.isobject');
      cb();
    });
  });

  it('should install to devDependencies in package.json', function(cb) {
    app.npm.saveDev('isobject', function(err) {
      if (err) return cb(err);
      assert(pkg.has('devDependencies.isobject'));
      pkg.del('devDependencies.isobject');
      cb();
    });
  });
});
