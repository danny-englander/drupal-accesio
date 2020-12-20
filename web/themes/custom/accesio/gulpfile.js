const gulp = require('gulp'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  sourcemaps = require('gulp-sourcemaps'),
  imagemin = require('gulp-imagemin'),
  pngquant = require('imagemin-pngquant'),
  prefix = require('gulp-autoprefixer'),
  sassGlob = require('gulp-sass-glob'),
  browserSync = require('browser-sync').create(),
  rename = require('gulp-rename'),
  cleanCSS = require('gulp-clean-css'),
  debug = require('gulp-debug'),
  mode = require('gulp-mode')();

const uglifyes = require('uglify-es');
const composer = require('gulp-uglify/composer');
const uglify = composer(uglifyes, console);

// Add browsersync.
// Add browsersync.
gulp.task('browser-sync', ['sass'], function () {
  browserSync.init({
    injectChanges: true,
    logPrefix: 'Default Theme',
    baseDir: './',
    open: false,
    notify: true,
    proxy: 'd9components.docksal',
    host: 'd9components.docksal',
    openBrowserAtStart: false,
    reloadOnRestart: true,
    port: 3034,
    ui: false,
  });
});
// JS.
gulp.task('scripts', function () {
  return gulp.src('./src/js/**/*.js')
    .pipe(gulp.dest('./dist/js'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(uglify())
    .on('error', function (err) {
      console.log(err)
    })
    .pipe(gulp.dest('./dist/js/min'))
});

gulp.task('sass', function () {
  return gulp.src(['./src/scss/**/*.scss'])
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass({
      outputStyle: 'expanded',
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 4 versions'],
      cascade: false
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.reload({
      stream: true,
      match: '**/*.css'
    }));
});

// browser-sync watch.
gulp.task('watch', ['browser-sync'], function (gulpCallback) {
  gulp.watch("./src/scss/**/*.scss", ['sass']);
  gulp.watch("./src/js/**/*.js", ['scripts']).on('change', browserSync.reload);
  gulp.watch("./templates/**/*.html.twig").on('change', browserSync.reload);
  // Notify gulp that this task is done.
  gulpCallback();
});

// Task: Build assets.
gulp.task('build', ['sass', 'scripts']);
// Task: Default gulp build and watch.
gulp.task('default', ['sass', 'scripts', 'watch']);
