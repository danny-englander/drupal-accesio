'use strict';

const {gulp, dest, parallel, series, src, watch, lastRun} = require('gulp');
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require('gulp-sourcemaps');
const gulpStylelint = require("gulp-stylelint");
const svgSprite = require('gulp-svg-sprite');
const browsersync = require('browser-sync').create();
const plumber = require("gulp-plumber");
const cache = require('gulp-cached');
const babel = require('gulp-babel');
const uglifyes = require('uglify-es');
const composer = require('gulp-uglify/composer');
const uglify = composer(uglifyes, console);

/**
 ******************************************************
 * New gulp component functions, 2021.
 */

// Compile CSS from scss.
function buildCompStyles() {
  return src(['./build/src/scss/**/*.scss'])
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: ["./node_modules/sass-mq/"],
      outputStyle: 'expanded',
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(dest('./build/dist/css'))
    .pipe(browsersync.reload({
      stream: true
    }));
}

// SCSS style linter.
function lintSCSS() {
  return src("./build/src/scss/**/**/*.scss", {since: lastRun(lintSCSS)})
    .pipe(gulpStylelint({
      failAfterError: false,
      reporters: [{
        formatter: 'string',
        console: true
      }]
    }))
}

// JS build function.
function buildJS() {
  return src(['./build/src/js/**/*.js'])
    // .pipe(uglify())
    .pipe(dest('./build/dist/js'))
}

// BrowserSync Reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// Watch changes on JS and twig files and trigger functions at the end.
function watchJSTwigFiles() {
  watch(
    [
      './build/src/js/**/*.js',
      './templates/**/*.html.twig'
    ],
    {
      events: 'all',
      ignoreInitial: false
    },
    series(
      buildJS,
      browserSyncReload
    )
  );
}

// Watch changes on sass files and trigger functions at the end.
function watchCompFiles() {
  watch(
    [
      './build/src/scss/**/*.scss',
    ],
    {
      events: 'all',
      ignoreInitial: false
    },
    series(
      lintSCSS,
      buildCompStyles
    )
  );
}

// Init BrowserSync.
function browserSync(done) {
  browsersync.init({
    injectChanges: true,
    logPrefix: 'Accesio Theme Components',
    baseDir: './',
    open: false,
    notify: true,
    proxy: 'accesio-lp.lndo.site',
    host: 'accesio-lp.lndo.site',
    openBrowserAtStart: false,
    reloadOnRestart: true,
    port: 32456,
    ui: false,
  });
  done();
}

// New component tasks.
// gulp comp.
exports.default = parallel(browserSync, watchCompFiles, watchJSTwigFiles);
// gulp sass.
exports.sass = buildCompStyles;
// gulp watch.
exports.watch = watchCompFiles;
// gulp buildcomp.
exports.deploy = series(buildCompStyles, buildJS);
