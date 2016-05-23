var gulp          = require('gulp');
var notify        = require('gulp-notify');
var source        = require('vinyl-source-stream');
var rename        = require('gulp-rename');
var uglify        = require('gulp-uglify');
var merge         = require('merge-stream');
var browserSync   = require('browser-sync').create();

// Where our files are located
var jsFile   = "src/app.js";
var viewFile = "src/index.html";

var interceptErrors = function(error) {
  var args = Array.prototype.slice.call(arguments);

  // Send error to notification center with gulp-notify
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args);

  // Keep gulp from hanging on this task
  this.emit('end');
};


gulp.task('js', function(){
  return gulp.src("src/app.js")
      .on('error', interceptErrors)
      .pipe(gulp.dest('./build/'));
});

gulp.task('html', function() {
  return gulp.src("src/index.html")
      .on('error', interceptErrors)
      .pipe(gulp.dest('./build/'));
});


gulp.task('styles', function() {
  return gulp.src('src/stylesheets/*.css')
    .on('error', interceptErrors)
    .pipe(gulp.dest('./build/stylesheets/'));
});



gulp.task('default', ['html', 'styles', 'js'], function() {

  browserSync.init(['./build/**/**.**'], {
    server: "./build",
    port: 5000,
    notify: false
  });

  gulp.watch(viewFile, ['html']);
  gulp.watch(jsFile, ['js']);
  gulp.watch("src/stylesheets/*.css", ['styles']);

});
