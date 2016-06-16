# base-npm [![NPM version](https://img.shields.io/npm/v/base-npm.svg?style=flat)](https://www.npmjs.com/package/base-npm) [![NPM downloads](https://img.shields.io/npm/dm/base-npm.svg?style=flat)](https://npmjs.org/package/base-npm) [![Build Status](https://img.shields.io/travis/node-base/base-npm.svg?style=flat)](https://travis-ci.org/node-base/base-npm)

Base plugin that adds methods for programmatically running npm commands.

You might also be interested in [base-bower](https://github.com/jonschlinkert/base-bower).

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install base-npm --save
```

## Usage

```js
var npm = require('base-npm');
var Base = require('base');
var app = new Base();
app.use(npm());

// install npm packages `micromatch` and `is-absolute` to devDependencies
app.npm.devDependencies(['micromatch', 'is-absolute'], function(err) {
  if (err) throw err;
});
```

## API

### [.npm](index.js#L37)

Execute `npm install` with the given `args`, package `names` and callback.

**Params**

* `args` **{String|Array}**
* `names` **{String|Array}**
* `cb` **{Function}**: Callback

**Example**

```js
app.npm('--save', ['isobject'], function(err) {
  if (err) throw err;
});
```

### [.npm.install](index.js#L62)

Install one or more packages. Does not save anything to package.json. Equivalent of `npm install foo`.

**Params**

* `names` **{String|Array}**: package names
* `cb` **{Function}**: Callback

**Example**

```js
app.npm.install('isobject', function(err) {
  if (err) throw err;
});
```

### [.npm.latest](index.js#L80)

(Re-)install and save the latest version of all `dependencies` and `devDependencies` currently listed in package.json.

**Params**

* `cb` **{Function}**: Callback

**Example**

```js
app.npm.latest(function(err) {
  if (err) throw err;
});
```

### [.npm.dependencies](index.js#L114)

Execute `npm install --save` with one or more package `names`. Updates `dependencies` in package.json.

**Params**

* `names` **{String|Array}**
* `cb` **{Function}**: Callback

**Example**

```js
app.npm.dependencies('micromatch', function(err) {
  if (err) throw err;
});
```

### [.npm.devDependencies](index.js#L144)

Execute `npm install --save-dev` with one or more package `names`. Updates `devDependencies` in package.json.

**Params**

* `names` **{String|Array}**
* `cb` **{Function}**: Callback

**Example**

```js
app.npm.devDependencies('isobject', function(err) {
  if (err) throw err;
});
```

### [.npm.global](index.js#L173)

Execute `npm install --global` with one or more package `names`.

**Params**

* `names` **{String|Array}**
* `cb` **{Function}**: Callback

**Example**

```js
app.npm.global('mocha', function(err) {
  if (err) throw err;
});
```

### [.npm.exists](index.js#L200)

Check if one or more names exist on npm.

**Params**

* `names` **{String|Array}**
* `cb` **{Function}**: Callback
* `returns` **{Object}**: Object of results where the `key` is the name and the value is `true` or `false`.

**Example**

```js
app.npm.exists('isobject', function(err, results) {
  if (err) throw err;
  console.log(results.isobject);
});
//=> true
```

## History

**v0.4.0**

* adds `global` method for installing with the `--global` flag
* adds `exists` method for checking if a package exists on `npm`
* removes [base-questions](https://github.com/node-base/base-questions)
* removes `askInstall` method (moved to [base-npm-prompt](https://github.com/node-base/base-npm-prompt))

**v0.3.0**

* improved instance checks
* adds [base-questions](https://github.com/node-base/base-questions)
* adds `dependencies` method
* adds `devDependencies` method

## Related projects

You might also be interested in these projects:

* [base-questions](https://www.npmjs.com/package/base-questions): Plugin for base-methods that adds methods for prompting the user and storing the answers on… [more](https://www.npmjs.com/package/base-questions) | [homepage](https://github.com/node-base/base-questions)
* [base-task](https://www.npmjs.com/package/base-task): base plugin that provides a very thin wrapper around [https://github.com/doowb/composer](https://github.com/doowb/composer) for adding task methods to… [more](https://www.npmjs.com/package/base-task) | [homepage](https://github.com/node-base/base-task)
* [base](https://www.npmjs.com/package/base): base is the foundation for creating modular, unit testable and highly pluggable node.js applications, starting… [more](https://www.npmjs.com/package/base) | [homepage](https://github.com/node-base/base)

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/node-base/base-npm/issues/new).

## Building docs

Generate readme and API documentation with [verb](https://github.com/verbose/verb):

```sh
$ npm install verb && npm run docs
```

Or, if [verb](https://github.com/verbose/verb) is installed globally:

```sh
$ verb
```

## Running tests

Install dev dependencies:

```sh
$ npm install -d && npm test
```

## Author

**Jon Schlinkert**

* [github/jonschlinkert](https://github.com/jonschlinkert)
* [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

## License

Copyright © 2016, [Jon Schlinkert](https://github.com/jonschlinkert).
Released under the [MIT license](https://github.com/node-base/base-npm/blob/master/LICENSE).

***

_This file was generated by [verb](https://github.com/verbose/verb), v0.9.0, on June 16, 2016._