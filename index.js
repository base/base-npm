/*!
 * base-npm (https://github.com/jonschlinkert/base-npm)
 *
 * Copyright (c) 2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var path = require('path');
var commands = require('spawn-commands');

module.exports = function(options) {
  return function(app) {
    if (this.isRegistered('base-npm')) return;

    /**
     * Execute `npm install` with the given `args`, package `names`
     * and callback.
     *
     * ```js
     * app.npm('--save', ['isobject'], function(err) {
     *   if (err) throw err;
     * });
     * ```
     * @name .npm
     * @param {String|Array} `args`
     * @param {String|Array} `names`
     * @param {Function} `cb` Callback
     * @api public
     */

    this.define('npm', npm);

    function npm(args, names, cb) {
      if (typeof args === 'function') {
        cb = args;
        args = [];
      }
      names = Array.isArray(names) ? names : [names];
      var args = ['install', ...names].concat(args || []);
      commands({cmd: 'npm', args: args}, cb);
    }

    /**
     * Execute `npm install` with one or more package `names`. Does not
     * save anything to package.json.
     *
     * ```js
     * app.npm.install('isobject', function(err) {
     *   if (err) throw err;
     * });
     * ```
     * @name .npm.install
     * @param {String|Array} `names`
     * @param {Function} `cb` Callback
     * @api public
     */

    npm.install = function install(names, cb) {
      npm(null, names, cb);
    };

    /**
     * (Re-)install and save the latest version of all `dependencies`
     * and `devDependencies` listed in package.json.
     *
     * ```js
     * app.npm.latest(function(err) {
     *   if (err) throw err;
     * });
     * ```
     * @name .npm.latest
     * @param {Function} `cb` Callback
     * @api public
     */

    npm.latest = function(cb) {
      var deps = latest(Object.keys(pkg(this).dependencies));
      var devDeps = latest(Object.keys(pkg(this).devDependencies));
      npm.save(deps, function(err) {
        if (err) return cb(err);
        npm.saveDev(devDeps, cb);
      });
    };

    /**
     * Execute `npm install --save` with one or more package `names`.
     * Updates `dependencies` in package.json.
     *
     * ```js
     * app.npm.save('micromatch', function(err) {
     *   if (err) throw err;
     * });
     * ```
     * @name .npm.save
     * @param {String|Array} `names`
     * @param {Function} `cb` Callback
     * @api public
     */

    npm.save = function save(names, cb) {
      if (typeof names === 'function') {
        cb = names;
        names = Object.keys(pkg(this).dependencies);
      }
      npm('--save', names, cb);
    };

    /**
     * Execute `npm install --save-dev` with one or more package `names`.
     * Updates `devDependencies` in package.json.
     *
     * ```js
     * app.npm.saveDev('isobject', function(err) {
     *   if (err) throw err;
     * });
     * ```
     * @name .npm.saveDev
     * @param {String|Array} `names`
     * @param {Function} `cb` Callback
     * @api public
     */

    npm.saveDev = function saveDev(names, cb) {
      if (typeof names === 'function') {
        cb = names;
        names = Object.keys(pkg(this).devDependencies);
      }
      npm('--save-dev', names, cb);
    };
  };
};

function pkg(app) {
  var pkgPath = path.resolve(app.cwd || process.cwd(), 'package.json');
  return app.pkg ? app.pkg.data : require(pkgPath);
}

function latest(keys) {
  return keys.map(function(key) {
    return key + '@latest';
  });
}
