const path = require('path');
const autoprefixer = require('autoprefixer');
const merge = require('webpack-merge');
const validate = require('webpack-validator');

const parts = require('./lib/parts');

const development = require('./dev.config');
const production = require('./prod.config');

const TARGET = process.env.npm_lifecycle_event;

const PATHS = {
  app: path.join(__dirname, '../src'),
  build: path.join(__dirname, '../build'),
};

process.env.BABEL_ENV = TARGET;

const common = {
  entry: {
    app: PATHS.app,
  },
  output: {
    path: PATHS.build,
    filename: 'app.js',
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
      parts.extractStyles(PATHS.app),
      production
    );
    break;
  default:
    config = merge(
      common,
      parts.devServer({
        host: process.env.HOST,
        port: process.env.PORT,
      }),
      parts.setupStyles(PATHS.app),
      development
    );
}

module.exports = validate(config);
