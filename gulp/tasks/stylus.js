var gulp = require('gulp'),
    gulpStylus = require('gulp-stylus'),
    gulpAutoprefixer = require('gulp-autoprefixer'),
    gulpRename = require('gulp-rename');

module.exports = function(){
    //dev
    gulp.src('./src/stylus/*.styl', { base: './' })
        .pipe(gulpStylus())
        .pipe(gulpAutoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(gulpRename({
            dirname: 'css'
        }))
        .pipe(gulp.dest('./build/'));

    //production
    gulp.src('./src/stylus/*.styl', { base: './' })
        .pipe(gulpStylus({ compress: true }))
        .pipe(gulpAutoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(gulpRename({
            dirname: 'css',
            suffix: '.min'
        }))
        .pipe(gulp.dest('./build/'));
}