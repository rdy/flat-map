var gulp = require('gulp');
var runSequence = require('run-sequence');

gulp.task('default', callback => runSequence('lint', 'spec', callback));
