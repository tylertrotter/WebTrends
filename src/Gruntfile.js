module.exports = function(grunt) {
  grunt.initConfig({
    watch: {
      scripts: {
        files: ['index.html', 'js/*', 'styles/*'],
        tasks: ['sass', 'copy'],
        options: {
          livereload: true,
        },
      },
    },
    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: 'styles',
          src: 'app.scss',
          dest: '../dist/css/',
          ext: '.css'
        }]
      }
    },
    copy: {
      main: {
        files: [
          // includes files within path
          {expand: true, src: ['index.html'], dest: '../dist/', filter: 'isFile'},
          {expand: true, src: ['node_modules/pikaday/pikaday.js'], dest: '../dist/', filter: 'isFile'},
          {expand: true, src: ['js/webtrends.js'], dest: '../dist/', filter: 'isFile'}
          //
          // // includes files within path and its sub-directories
          // {expand: true, src: ['path/**'], dest: 'dest/'},
          //
          // // makes all src relative to cwd
          // {expand: true, cwd: 'path/', src: ['**'], dest: 'dest/'},
          //
          // // flattens results to a single level
          // {expand: true, flatten: true, src: ['path/**'], dest: 'dest/', filter: 'isFile'},
        ],
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['watch']);
};
