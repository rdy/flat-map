var del = require('del');
var gulp = require('gulp');
var mergeStream = require('merge-stream');
var plugins = require('gulp-load-plugins')();
var runSequence = require('run-sequence');

gulp.task('clean', function(callback) {
  del('dist', callback);
});

gulp.task('build', function(callback) {
  runSequence('clean', 'babel', callback);
});

gulp.task('babel', function() {
  return mergeStream(
    gulp.src('src/**/*.js').pipe(plugins.babel()),
    gulp.src(['LICENSE', 'README.md', 'package.json'])
  ).pipe(gulp.dest('dist'));
});

gulp.task('build', function(callback) {
  runSequence('clean', 'babel', callback);
});

gulp.task('watch', ['build'], function() {
  gulp.watch('src/**/*.js', ['babel']);
});