'use strict';

module.exports = function (grunt) {
  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    config: require('./config/config'),
    connect: require('./config/connect'),
    copy: require('./config/copy'),
    clean: require('./config/clean'),
    jshint: require('./config/jshint'),
    useminPrepare: require('./config/usemin-prepare'),
    usemin: require('./config/usemin')
  });

  grunt.registerTask('build', [
    'clean',
    'useminPrepare',
    'concat',
    'uglify',
    'requirejs',
    'copy',
    'usemin'
  ]);

  grunt.registerTask('serve', ['connect:dev']);
  grunt.registerTask('default', ['serve']);

};
