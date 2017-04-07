var gulp = require('gulp'),
    // webserver = require('gulp-webserver'),
    connect = require('gulp-connect')
    less = require('gulp-less');

var plugins = require('gulp-load-plugins')({
  rename: {
    'gulp-html-replace': 'htmlReplace',
    'gulp-minify-html': 'minifyHTML',
    'gulp-minify-css' : 'minifyCSS'

  }
});


gulp.task('server', function(){
  connect.server({
    root: ['./app'],
    livereload: true,
    port:8888
  });
})

gulp.task('livereload', function () {
  gulp.src(['/app/style/*.css', './app/js/*.js', '*.html'])
      .pipe(watch())
      .pipe(connect.reload());
});

gulp.task('less', function(){
    gulp.src('app/style/*.less')
        .pipe(less({
          paths: [
              '.',
              './node_modules/bootstrap-less'
          ]
        }))
        .pipe(gulp.dest('app/css/'))
        .pipe(connect.reload())
})

gulp.task('html', function(){
  gulp.src('*.html')
      .pipe(connect.reload())
})

gulp.task('watch', function(){
  //watch .js
  //gulp.watch('app/scripts/**/*.js', ['script'])

  //gulp.watch('src/imgs/**/*', ['imgs']);

  //css

  //less
  gulp.watch('app/style/*.less',['less'])
  //html
  gulp.watch('*.html', ['html'])
})

gulp.task('lessServer', ['less', 'server', 'watch', 'livereload']);

// gulp.task('webserver', function(){
//     gulp.src('./app/')
//         .pipe(plugins.webserver({
//           port:1234,
//           livereload: true,
//           directoryListing: false,
//           open: true,
//           fallback:'index.html'
//         }))
//
// })
//


gulp.task('default', ['html-replace','minify-css', 'uglifyJs'], function(){
  console.log('execute default task');
})

//concat
gulp.task('concat', function(){
  return gulp.src('app/css/*.css')
            .pipe(plugins.concat('all.css'))
            .pipe(gulp.dest('./build/css/'))
})
//minify and uglifycss
gulp.task('minify-css', ['concat'], function(){
  return gulp.src('./build/css/all.css')
            .pipe(plugins.minifyCSS({
              keepBreak: true,
            }))
            .pipe(plugins.uglifycss())
            .pipe(plugins.rename(function(path){
              path.basename += '.min';
              path.extname = '.css'
            }))
            .pipe(gulp.dest('./build/css/'))

})

//html-replace
gulp.task('html-replace', function(){
  var opts = {comment:false, spare:false, quote:true};
  return gulp.src('./app/*.html')
            .pipe(plugins.htmlReplace({
              'css': 'css/all.min.css',
              'js':'js/app.min.js'
            }))
            .pipe(plugins.minifyHTML(opts))
            .pipe(gulp.dest('./build'))
})
//uglify js
gulp.task('uglifyJs', function(){
  return gulp.src('./app/js/*.js')
            .pipe(plugins.concat('app.js'))
            .pipe(plugins.uglify())
            .pipe(plugins.rename(function(path){
              path.basename +='.min';
              path.extname ='.js'
            }))
            .pipe(gulp.dest('./build/js'))
})
