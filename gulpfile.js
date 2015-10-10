var gulp = require('./gulp/index.js')([
    'stylus',
    'js',
    'watch'
]);


gulp.task('build', ['stylus', 'js']);
gulp.task('dev', ['watch']);