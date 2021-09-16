const {parallel, series, src, watch, lastRun} = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const babelify = require("babelify");
const browserify = require("browserify");
const browserSync = require('browser-sync').create();
const buffer = require("vinyl-buffer");
const cleanCSS = require('gulp-clean-css');
const cssComb = require('gulp-csscomb');
const gcmq = require('gulp-group-css-media-queries');
const gulp = require("gulp");
const sass = require('gulp-sass')(require('sass'));
const gulpStylelint = require("gulp-stylelint");
const source = require("vinyl-source-stream");
const sourcemaps = require('gulp-sourcemaps');
const uglify = require("gulp-uglify");
const svgSprite = require('gulp-svg-sprite');

/**
 * List of paths and settings for gulp functions.
 */
const settings = {
  sass: {
    browserList: ['last 4 versions'],
    cssComb: './csscomb.json',
    dest: './build/dist/css',
    // Add node modules sass file paths if needed.
    node_includes: [""],
    minDest: './build/dist/css/min',
    minSrc: ['./build/dist/css/**/*.css'],
    src: ['./build/src/scss/**/*.scss']
  },
  js: {
    dest: './build/dist/js',
    minDest: './build/dist/js/min',
    minSrc: './build/src/js/**/*.js',
    src: './build/src/js/**/*.js'
  },
  svg: {
    example: {
      html: '../build/dist/icon/icons.html',
    },
    render: {
      scss_dest: '../build/src/scss/_icons.scss',
      template: './build/src/icon/svg-sprite-template.txt'
    },
    icon_files: "./build/src/icon/svg",
    sprite: '../build/dist/icon/icons.svg'
  },
}

/**
 * Used to create instance of browser-sync
 *
 * Notice: Update port to reflect same port on Lando.
 * Notice: Update proxy and host property with the uri
 * lando returns when starts up or lando info.
 *
 * @param callback
 */
const browserSyncInit = (callback) => {
  browserSync.init({
    injectChanges: true,
    logPrefix: 'Accesio theme',
    baseDir: './',
    open: false,
    notify: true,
    proxy: 'accesio-dcd.docksal',
    host: 'accesio-dcd.docksal',
    openBrowserAtStart: false,
    reloadOnRestart: true,
    port: 31549,
    ui: false,
    reloadDelay: 200
  });
  callback();
}

/**
 * Used to reload browser-sync
 *
 * @param callback callback
 */
const browserSyncReload = (callback) => {
  browserSync.reload();
  callback();
}

/**
 * SVGSprite configuration.
 */
const svgConfig = {
  svgSprite: {
    shape: {
      // Set maximum dimensions.
      dimension: {
        maxWidth: 110,
        maxHeight: 110
      },
      // Add padding.
      spacing: {
        padding: 0
      },
    },
    mode: {
      view: {
        bust: false,
        common: 'ico',
        example: {
          dest: settings.svg.example.html
        },
        prefix: '.',
        render: {
          scss: {
            template: settings.svg.render.template,
            dest:settings.svg.render.scss_dest
          }
        },
        sprite: settings.svg.sprite,
      }
    }
  }
}

/**
 * SVGSprite build.
 */
const svgBuild = () => {
  return src('**/*.svg', {
    cwd: settings.svg.icon_files
  })
    // Use the config for SVG (svgConfig).
    .pipe(svgSprite(svgConfig.svgSprite))
    .pipe(gulp.dest('./'));
}

/**
 * Sass stylelint, checks for well formatted code.
 */
const lintSCSS = () => {
  return src(settings.sass.src, {since: lastRun(lintSCSS)})
    .pipe(gulpStylelint({
      failAfterError: false,
      reporters: [{
        formatter: 'string',
        console: true
      }]
    }))
}

/**
 * Compile prod SCSS to CSS.
 *
 * Uses:
 *  sourcemaps
 *  autoprefixer
 *  CSS Comb
 * @returns Gulp.src
 */
const compileCSS = () => {
  return src(settings.sass.src)
    .pipe(sourcemaps.init())
    .pipe(sass({
      // Include node_modules paths as needed.
      includePaths: settings.sass.node_includes,
      outputStyle: 'expanded',
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      overrideBrowserslist: settings.sass.browserList,
      cascade: false
    }))
    .pipe(gcmq())
    .pipe(cssComb(settings.sass.cssComb))
    .pipe(cleanCSS())
    .pipe(gulp.dest(settings.sass.dest))
}

/**
 * Compile Javascript.
 *
 * @returns Gulp.src
 */
const compileJS = () => {
  // Get each src file and send to dist
  // to promote individual calls to files per component.
  return src(settings.js.src)
    .pipe(uglify())
    .pipe(gulp.dest(settings.js.dest))
    .on('error', function (err) {
      console.log(err)
    })
}

/**
 * Compile the watch version of the css.
 * This includes stream: true for live CSS
 * injection without a page reload.
 * Removed some task that only need run on build.
 *
 * @returns Gulp.src
 */
const watchSCSS = () => {
  return src(settings.sass.src)
    .pipe(sourcemaps.init())
    .pipe(sass({
      // Include node_modules paths as needed.
      includePaths: settings.sass.node_includes,
      outputStyle: 'expanded',
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      overrideBrowserslist: settings.sass.browserList,
      cascade: false
    }))
    // Combine media queries.
    .pipe(gcmq())
    // Write the sourcemap to its own file in place.
    .pipe(sourcemaps.write('./'))
    // Refine and format CSS sorting.
    .pipe(cssComb(settings.sass.cssComb))
    .pipe(gulp.dest(settings.sass.dest))
    // Live CSS injection without a page reload using BS stream.
    .pipe(browserSync.reload({
      stream: true
    }));
}

/**
 * Use gulp.watch to look for any changes in CSS and fire off
 * any task that need to run.
 */
const gulpWatchCSS = () => {
  watch(
    [
      './build/src/scss/**/*.scss',
    ],
    {
      events: 'all',
      ignoreInitial: false
    },
    series(
      watchSCSS,
      lintSCSS
    )
  );
}

/**
 * Watch Twig files for changes and reload if there are.
 */
const gulpWatchTwig = () => {
  watch(
    [
      './templates/**/*.html.twig'
    ],
    {
      events: 'all',
      ignoreInitial: false
    },
    series(
      browserSyncReload
    )
  );
}

/**
 * Use gulp.watch to look for any changes in JS files
 * and fire off any task that need to run.
 * @todo - add JS linting.
 */
const gulpWatchJS = () => {
  watch(
    [
      './build/src/js/**/*.js',
    ],
    {
      events: 'all',
      ignoreInitial: false
    },
    series(
      compileJS,
      browserSyncReload
    )
  );
}

/**
 * Compile scss to css.
 *
 * command: gulp css
 */
const css = series(compileCSS)

/**
 * Compile JS and SCSS.
 *
 * command: gulp build
 */
const build = series(parallel(compileCSS, compileJS, lintSCSS))

/**
 * Compile JS.
 *
 * command: gulp js
 */
const js = series(compileJS)

/**
 * Build SVG.
 *
 * command: gulp svg
 */
const svg = series(svgBuild)

/**
 * Watch for changes in scss and js and build build.
 * Browser sync will inject changes.
 */
const watchFiles = parallel(browserSyncInit, gulpWatchCSS, gulpWatchJS, gulpWatchTwig);

// Export tasks.
// These are in the lando file so that you
// can run "lando watch" for example.
// Default task.
exports.default = exports.build = build;
// Compile CSS without a watch task (compileCSS).
exports.css = css;
// Compile JS (compileJS)
exports.js = js;
// Compile SVGs (svgBuild)
exports.svg = svg;
// Main gulp watch task. (watchFiles)
exports.watch = watchFiles;
