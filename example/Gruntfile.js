/**
 * Gruntfile configuration example.
 *
 * @param {object} grunt Grunt configuration.
 */
module.exports = function(grunt) {
  grunt.loadTasks('../tasks');

  grunt.initConfig({
    removecalls: {
      dist: {
        src: 'js/app.js',
        dest: 'js/output.js'
      },
      options: {
        namespaces: [
          'logger',
          'console'
        ],
        methods: [
          'log',
          'warn',
          'error',
          'assert',
          'count',
          'clear',
          'trace',
          'debug',
          'table',
          'exception',
          'test',
          'info',
          'notice',
          'warning',
          'critical',
          'alert',
          'emergency'
        ]
      }
    }
  });

  grunt.registerTask('default', ['removecalls']);
};
