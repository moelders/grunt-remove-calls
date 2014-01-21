/*!
 * Grunt Remove Method Calls
 *
 * Code based on the Grunt Remove Logging plugin:
 * https://github.com/ehynds/grunt-remove-logging
 * Copyright (c) 2013 Eric Hynds
 * Licensed under the MIT license.
 */

/**
 * Grunt task.
 *
 * @param {object} grunt Grunt variable.
 */
module.exports = function(grunt) {
  var removeCallsTask = require('./lib/remove-calls.js').init(grunt);

  grunt.registerMultiTask('removecalls', 'Remove method calls', function() {
    var opts = this.options();

    function _processFile(src) {
      var result = removeCallsTask(grunt.file.read(src), opts);

      grunt.log.writeln([
        'Removed ',
        result.count,
        ' method call statements from ',
        src
      ].join(''));

      return result;
    }

    this.files.forEach(function(file) {
      var ret;

      if (typeof file.dest === 'undefined') {
        file.src.forEach(function(file) {
          grunt.file.write(file, _processFile(file).src);
        });
      } else {
        ret = file.src.map(function(src) {
          if (grunt.file.isFile(src)) {
            return _processFile(src).src;
          } else {
            grunt.log.error('File not found ', src);
          }
        }).join('');

        if (ret) {
          grunt.file.write(file.dest, ret);
        }
      }
    });
  });
};
