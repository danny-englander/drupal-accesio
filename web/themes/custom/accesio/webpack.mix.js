const mix = require('laravel-mix');
const path = require('path');
const glob = require('glob');
const StylelintPlugin = require('stylelint-webpack-plugin');

// Compile styles.scss into styles.css.
mix.sass('src/scss/styles.scss', 'dist/css');

// Automatically compile all other individual scss files in the src directory.
glob.sync(path.resolve(__dirname, 'src/scss/**/*.scss')).forEach(file => {
  // Exclude styles.scss and the helper files.
  if (file.includes('styles.scss') || file.includes('_global-includes.scss') || file.includes('_settings.scss')) {
    return;
  }

  const output = file.match(/src\/scss\/(.*)\.scss$/)[1]; // This extracts the path without the "src/scss/" prefix and the ".scss" suffix.

  mix.sass(file, `dist/css/${output}.css`);
});

mix.webpackConfig({
  plugins: [
    new StylelintPlugin({
      configFile: '.stylelintrc.js',
      failOnError: true,
      context: './src/scss',
      files: ['**/*.scss'],
      quiet: false,
      syntax: 'scss',
    })
  ]
});
