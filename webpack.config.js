const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const pkg = require('./package.json');

const TARGET = process.env.npm_lifecycle_event;

const PATHS = {
  app: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'build'),
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
        test: /\.css$/,
        loaders: ['style', 'css'],
        include: PATHS.app,
      }, {
        test: /\.scss$/,
        loaders: ['style', 'css', 'postcss', 'sass'],
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
        test: /\.png$/,
        loader: 'file?name=[name].[ext]',
      }, {
        test: /\.jpg$/,
        loader: 'file?name=[name].[ext]',
      }, {
        test: /\.gif$/,
        loader: 'file?name=[name].[ext]',
      },
    ],
  },
  postcss: [autoprefixer({ browsers: ['last 2 versions'] })],
};

if (TARGET === 'start' || !TARGET) {
  module.exports = merge(common, {
    devServer: {
      contentBase: PATHS.build,
      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true,
      stats: 'errors-only',
      host: process.env.HOST,
      port: process.env.PORT || 3000,
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin({
        inject: false,
        template: 'node_modules/html-webpack-template/index.ejs',
        appMountId: 'app',
        title: 'React Mobx Seed / Boilerplate',
      }),
    ],
  });
}

if (TARGET === 'build' || TARGET === 'stats') {
  module.exports = merge(common, {
    entry: {
      vendor: Object.keys(pkg.dependencies),
      style: PATHS.style,
    },
    output: {
      path: PATHS.build,
      // Output using entry name
      filename: '[name].[chunkhash].js',
      chunkFilename: '[chunkhash].js',
    },
    module: {
      loaders: [
        // Extract CSS during build
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract('style', 'css'),
          include: PATHS.app,
        }, {
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract('style', 'css!postcss!sass'),
          include: PATHS.app,
        },
      ],
    },
    plugins: [
      new CleanPlugin([PATHS.build]),
      new webpack.optimize.DedupePlugin(),
      // Output extracted CSS to a file
      new ExtractTextPlugin('[name].[chunkhash].css'),
      // Extract vendor and manifest files
      new webpack.optimize.CommonsChunkPlugin({
        names: ['vendor', 'manifest'],
      }),
      // Setting DefinePlugin affects React library size!
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"',
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
          dead_code: true,
          unused: true,
          drop_console: true,
        },
      }),
      new HtmlWebpackPlugin({
        inject: false,
        template: 'node_modules/html-webpack-template/index.ejs',
        appMountId: 'app',
        title: 'React Mobx Seed - Easy Boilerplate',
      }),
    ],
  });
}
