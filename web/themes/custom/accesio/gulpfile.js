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
  mode = require('gulp-mode')(),
  uglifyes = require('uglify-es'),
  composer = require('gulp-uglify/composer'),
  uglify = composer(uglifyes, console),
  babel  = require('gulp-babel'),
  svgSprite = require('gulp-svg-sprite');

// const uglifyes = require('uglify-es');
// const composer = require('gulp-uglify/composer');
// const uglify = composer(uglifyes, console);

// Add browsersync.
gulp.task('browser-sync', ['sass'], function () {
  browserSync.init({
    injectChanges: true,
    logPrefix: 'Default Theme',
    baseDir: './',
    open: false,
    notify: true,
    proxy: 'accesio.docksal',
    host: 'accesio.docksal',
    openBrowserAtStart: false,
    reloadOnRestart: true,
    port: 3034,
    ui: false,
  });
});

var path = require('path');

// SVG icons.
gulp.task('svgSprite', function (done) {
  // Basic configuration example.
  var config = {
    shape: {
      dimension: {
        maxWidth: 100,
        maxHeight: 100
      },
      spacing: {
        padding: 2
      },
      "id": {
        "generator": function (name) {
          return path.basename(name.replace(/\s+/g, this.whitespace),'.svg');
        }
      }
    },
    mode: {
      view: {
        bust: false,
        common: 'ico',
        example: {
          dest: '../dist/icon/icons.html',
          template: './src/icon/sprite.html', // relative to current working directory
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
    cwd: './src/icon/remix/**/*'
  })
    .pipe(svgSprite(config))
    .pipe(gulp.dest('./'));
  done();
});

// JS.
gulp.task('scripts', function () {
  return gulp.src('./src/js/**/*.js')
    .pipe(babel({
      presets: ['@babel/env']
    }))
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
  return gulp.src(['!./src/scss/vendor/**/*.scss', './src/scss/accesio.scss'])
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
    }))
    .pipe(cleanCSS())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./dist/css/min'));
});

gulp.task('vendors', function () {
  return gulp.src(['./src/scss/vendor/*.scss', '!./src/scss/vendor/bs-grid'])
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded',
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 4 versions'],
      cascade: false
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/vendor/css'))
    .pipe(browserSync.reload({
      stream: true,
      match: '**/*.css'
    }))
    .pipe(cleanCSS())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./dist/vendor/css/min'));
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

gulp.task('vendor', ['vendors']);
