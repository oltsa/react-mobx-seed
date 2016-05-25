const path = require('path');
const autoprefixer = require('autoprefixer');
const merge = require('webpack-merge');
const validate = require('webpack-validator');

const parts = require('./lib/parts'); // modular webpack config imports

const pkg = require('../package.json');

const TARGET = process.env.npm_lifecycle_event;

const PATHS = {
  app: path.join(__dirname, '../src'), // app entry point
  build: path.join(__dirname, '../build'), // dist/build folder
  template: path.join(__dirname, '../templates', 'index.ejs'), // used to generate HTML
};

process.env.BABEL_ENV = TARGET;

const common = {
  entry: {
    app: PATHS.app,
  },
  output: {
    path: PATHS.build,
  },
  resolve: {
    extensions: ['', '.jsx', '.js', '.json', '.scss'],
    modulesDirectories: ['node_modules', PATHS.app],
  },
  module: {
    loaders: [
      {
        test: /\.js[x]?$/,
        loaders: ['babel?cacheDirectory'],
        include: PATHS.app,
      }, {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/font-woff',
      }, {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/font-woff2',
      }, {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/octet-stream',
      }, {
        test: /\.otf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/font-otf',
      }, {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file',
      }, {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=image/svg+xml',
      }, {
        test: /\.(png|jpg|gif)$/,
        loader: 'file?name=[name].[ext]',
      },
    ],
  },
  postcss: [autoprefixer({ browsers: ['last 2 versions'] })],
};

let config;

switch (process.env.npm_lifecycle_event) {
  case 'build':
    config = merge(
      common,
      {
        devtool: 'source-map',
        output: {
          path: PATHS.build,
          filename: '[name].[chunkhash].js',
          chunkFilename: '[chunkhash].js',
        },
      },
      parts.clean(PATHS.build),
      parts.setFreeVariable(    // uses webpack define plugin to set NODE_ENV to production
        'process.env.NODE_ENV', // effects size of builds in some packages (e.g react)
        'production'            // takes key/value pair
      ),
      parts.extractBundle({
        name: 'vendor',
        entries: Object.keys(pkg.dependencies), // collect deps from package.json for vendor bundle
      }),
      parts.minify(),           // minifies JS output, see lib/parts.js for more configurations
      parts.extractStyles(PATHS.app), // extracts and bundles css/scss - filename defined in lib
      parts.generateHTML(PATHS.template)
    );
    break;
  default:
    config = merge(
      common,
      {
        devtool: 'eval-source-map',
      },
      parts.devServer({         // adds dev server configurations
        host: process.env.HOST, // defines host, fallbacks to localhost
        port: process.env.PORT, // defines port, fallbacks to 3000
      }),
      parts.setFreeVariable(    // uses webpack define plugin to set NODE_ENV to development
        'process.env.NODE_ENV', // effects size of builds in some packages (e.g react)
        'development'           // takes key/value pair
      ),
      parts.setupStyles(PATHS.app),
      parts.generateHTML(PATHS.template)
    );
}

module.exports = validate(config);
