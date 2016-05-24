const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');

const pkg = require('../package.json');

const PATHS = {
  app: path.join(__dirname, '../src'),
  build: path.join(__dirname, '../build'),
  root: path.join(__dirname, '../'),
};

module.exports = {
  entry: {
    vendor: Object.keys(pkg.dependencies),
  },
  output: {
    path: PATHS.build,
    // Output using entry name
    filename: '[name].[chunkhash].js',
    chunkFilename: '[chunkhash].js',
  },
  plugins: [
    new CleanPlugin([PATHS.build], { root: PATHS.root }),
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
};
