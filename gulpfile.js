const {src, dest, watch, series} = require('gulp');
const cleanCSS = require('gulp-clean-css');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const server = require('browser-sync').create();

function js(done) {
  src('src/js/app.js')
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(dest('dist/app.js'))
  done();
}

function css(done) {
  src('src/css/style.css')
    .pipe(cleanCSS())
    .pipe(dest('dist/css'));
  done();
}

function reload(done) {
  server.reload();
  done();
}

function html(done) {
  src('src/index.html')
    .pipe(dest('dist'));
  done();
}
 
function serve(done) {
  server.init({
    server: {
      baseDir: './dist'
    }
  });
  done();
}

function watching() {
  watch('src/css/*.css', series(css, reload));
  watch('src/js/*.js', series(js, reload));
  watch('src/index.html', series(html, reload));
}

exports.default = series(js, html, css, serve, watching);