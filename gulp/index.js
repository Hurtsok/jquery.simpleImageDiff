var gulp = require('gulp'),
    path = require('path');

module.exports = function(tasks){
    if(!Array.isArray(tasks)){
        throw new SyntaxError('tasks must be an array');
    }

    tasks.forEach(function(task){
        gulp.task(task, require(__dirname + path.sep + 'tasks' + path.sep + task + '.js'));
    });

    return gulp;
}