var gulp = require('gulp');

module.exports = function(){
    var watcher = gulp.watch(['./src/stylus/*.styl', './src/javascript/*.js'], ['stylus', 'js']);
    watcher.on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
}