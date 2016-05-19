/*!
 * base-npm (https://github.com/jonschlinkert/base-npm)
 *
 * Copyright (c) 2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var path = require('path');
var extend = require('extend-shallow');
var spawn = require('cross-spawn');

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
    function npm(cmds, args, cb) {
      args = arrayify(cmds).concat(arrayify(args));
      spawn('npm', args, {stdio: 'inherit'})
        .on('error', cb)
        .on('close', function(code, err) {
          cb(err, code);
        });
    };

    /**
     * Install one or more packages. Does not save anything to
     * package.json. Equivalent of `npm install foo`.
     *
     * ```js
     * app.npm.install('isobject', function(err) {
     *   if (err) throw err;
     * });
     * ```
     * @name .npm.install
     * @param {String|Array} `names` package names
     * @param {Function} `cb` Callback
     * @api public
     */

    npm.install = function(args, cb) {
      npm('install', args, cb);
    };

    /**
     * (Re-)install and save the latest version of all `dependencies`
     * and `devDependencies` currently listed in package.json.
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

    npm.latest = function(names, cb) {
      if (typeof names !== 'function') {
        npm.install(latest(names), cb);
        return;
      }

      if (typeof names === 'function') {
        cb = names;
      }

      var devDeps = latest(pkg(app, 'devDependencies'));
      var deps = latest(pkg(app, 'dependencies'));

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

    npm.save = function(names, cb) {
      var args = [].concat.apply([], [].slice.call(arguments));
      cb = args.pop();

      if (args.length === 0) {
        args = pkg(app, 'dependencies');
      }

      if (!args.length) {
        cb();
        return;
      }
      npm.install(['--save'].concat(args), cb);
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

    npm.saveDev = function(names, cb) {
      var args = [].concat.apply([], [].slice.call(arguments));
      cb = args.pop();

      if (args.length === 0) {
        args = pkg(app, 'devDependencies');
      }

      if (!args.length) {
        cb();
        return;
      }
      npm.install(['--save-dev'].concat(args), cb);
    };

    /**
     * Prompts the user to ask if they want to install the given package(s).
     * Requires the [base-questions][] plugin to be registered first.
     *
     * ```js
     * app.npm.askInstall('isobject', function(err) {
     *   if (err) throw err;
     * });
     * ```
     * @name .npm.askInstall
     * @param {String|Array} `names` One or more package names.
     * @param {Object} `options`
     * @param {Function} `callback`
     * @api public
     */

    npm.askInstall = function(names, options, cb) {
      if (typeof app.ask !== 'function') {
        throw new Error('expected the base-questions to be registered');
      }

      if (typeof options === 'function') {
        cb = options;
        options = {};
      }

      // extend `data` onto options, which is used
      // by question-store to pre-populate answers
      options = extend({}, options, options.data);
      var type = (options.type || arrayify(names).join(', '));
      var key = 'install-' + type;
      var method = options.method || 'saveDev';
      var msg = options.message;

      app.on('ask', function(answer, key, question, answers) {
        if (typeof answer !== 'undefined' && question.name === key) {
          question.options.skip = true;
          answers[key] = answer;
        }
      });

      // allow prompt to be suppressed for unit tests
      if (options.noprompt === true) {
        options[key] = true;
      }

      if (typeof msg === 'undefined') {
        msg = 'Would you like to install ' + type + '?';
      }

      app.question(key, {message: msg, type: 'confirm', save: false});
      app.ask(key, options, function(err, answers) {
        if (err) return cb(err);
        if (answers[key] === true) {
          npm[method](names, cb);
        } else {
          cb();
        }
      });
    };
  };
};

/**
 * Get the package.json for the current project
 */

function pkg(app, prop) {
  return Object.keys(pkgData(app)[prop] || {});
}

function pkgPath(app) {
  return path.resolve(app.cwd || process.cwd(), 'package.json');
}

function pkgData(app) {
  return app.pkg ? app.pkg.data : require(pkgPath(app));
}

/**
 * Prefix package names with `@latest`
 */

function latest(keys) {
  if (typeof keys === 'string') {
    keys = [keys];
  }
  if (!Array.isArray(keys)) {
    return [];
  }
  return keys.map(function(key) {
    return key.charAt(0) !== '-' ? (key + '@latest') : key;
  });
}

/**
 * Cast `val` to an array
 */

function arrayify(val) {
  return val ? (Array.isArray(val) ? val : [val]) : [];
}
