# _grunt-remove-calls_

This [_Grunt_](http://gruntjs.com/) task removes all the method calls statementss from the _Javascript_ files.

It is based on the [_grunt-remove-logging_](https://npmjs.org/package/grunt-remove-logging) project using the next license:
```javascript
/*!
 * Grunt Remove Logging
 * https://github.com/ehynds/grunt-remove-logging
 *
 * Copyright (c) 2013 Eric Hynds
 * Licensed under the MIT license.
 */
```

In order to satisfy the clauses of the [_MIT license_](http://opensource.org/licenses/MIT), this project must use this license too.

## Installation

Before to run the task, it is necessary to have installed the [_Grunt_](http://gruntjs.com/) application installing the command line interface: [installing the _CLI_](http://gruntjs.com/getting-started).

Install this plugin adding it to the ``package.json`` file or using the next command:
> npm install grunt-remove-calls

## Documentation

The task must be configured in the project ``Gruntfile.js`` file adding the _NPM_ task:
> grunt.loadNpmTasks('grunt-remove-calls');

To configure it, there is two parameters:
* ``src``: source file path, file the statements will be removed.
* ``dest``: destination file path, this file will be created with the resulting source-code.

However, without specifying the ``namespaces`` and ``methods`` the task will do nothing.
* ``options.namespaces``: list of namespaces (default value: ``[]``).
* ``options.methods``: list of methods of the namespaces to remove (default value: ``[]``).

Example of ``Gruntfile.js`` configuration:
```js
grunt.loadNpmTasks('grunt-remove-logging');

grunt.initConfig({
  removecalls: {
    dist: {
      src: 'app.js',
      dest: 'app-clean.js',
      options: {
        namespaces: [
          'logger'
        ],
        methods: [
          'log',
          'debug'
        ]
      }
    }
  }
});
```

To run this task against multiple files and **automatically overwrite them**
with the resultant output, just omit the ``dest`` option:

```js
grunt.loadNpmTasks('grunt-remove-logging');

grunt.initConfig({
  removecalls: {
    dist: {
      src: 'tmp/**/*.js',
      options: {
        namespaces: [
          'logger'
        ],
        methods: [
          'log',
          'debug'
        ]
      }
    }
  }
});
```

### Optional configuration properties

This plugin can be customized by specifying the following options:

* ``replaceWith``: value to replace the statements with; the default option is an empty string.
   * **Note**: for fancy statements like ``console && console.log('foo');`` it is necessary to specify a value like ``0;`` so that the scripts do not completely break.

### Skipping Individual Statements

It is possible to keep specific call statements by adding the comment directive ``/*remove-calls:skip*/`` after the statement:
```javascript
object.method('foo');/*remove-calls:skip*/
object.method('foo')/*remove-calls:skip*/;
console.log('foo') /* remove-calls:skip */;
```
