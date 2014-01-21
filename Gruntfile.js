/**
 * Gruntfile configuration.
 *
 * @param {object} grunt Grunt configuration.
 */
module.exports = function(grunt) {
  grunt.initConfig({
    nodeunit: {
      all: [
        'test/**/*.js'
      ]
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'default'
    },
    jshint: {
      all: {
        files: {
          src: [
            'Gruntfile.js',
            'tasks/**/*.js',
            'test/**/*.js'
          ]
        },
        options: {
          jshintrc: '.jshintrc'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  grunt.registerTask('default', ['jshint', 'nodeunit']);
};
