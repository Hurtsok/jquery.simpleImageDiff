var gulp = require('gulp'),
    gulpRename = require('gulp-rename'),
    gulpUglify = require('gulp-uglify');

module.exports = function(){
    gulp.src('./src/javascript/*.js', { base: './' })
        .pipe(gulpUglify())
        .pipe(gulpRename({
            dirname: 'js',
            suffix: '.min'
        }))
        .pipe(gulp.dest('./build/'));
}