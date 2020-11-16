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
  uglify = require('gulp-uglify'),
  svgSprite = require('gulp-svg-sprite'),
  mode = require('gulp-mode')();

// Add browsersync.
// Add browsersync.
gulp.task('browser-sync', ['sass'], function () {
  browserSync.init({
    injectChanges: true,
    logPrefix: 'Default Theme',
    baseDir: './',
    open: false,
    notify: true,
    proxy: 'd8components.docksal',
    host: 'd8components.docksal',
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

// SVG icons.
gulp.task('svgSprite', function (done) {
  // Basic configuration example.
  var config = {
    shape: {
      dimension: {
        maxWidth: 110,
        maxHeight: 110
      },
      spacing: {
        padding: 0
      },
    },
    mode: {
      view: {
        bust: false,
        common: 'ico',
        example: {
          dest: '../src/icon/icons.html'
        },
        prefix: '.',
        render: {
          scss: {
            template: './src/icon/svg-sprite-template.scss',
            dest: '../src/scss/_icons.scss'
          }
        },
        sprite: '../src/icon/icons.svg',
      }
    }
  };

  gulp.src('**/*.svg', {
    cwd: './src/icon/raw'
  })
    .pipe(svgSprite(config))
    .pipe(gulp.dest('./'));
  done();
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
// Task: handle svgs.
gulp.task('svg', ['svgSprite']);
// Task: Default gulp build and watch.
gulp.task('default', ['sass', 'scripts', 'watch']);
