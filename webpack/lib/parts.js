const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

exports.devServer = options => ({
  devServer: {
    historyApiFallback: true,
    hot: true,
    inline: true,
    stats: 'errors-only',
    host: options.host, // Defaults to `localhost`
    port: options.port || 3000, // Defaults to 8080
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin({
      multiStep: true, // multi-pass compilation for enhanced performance
    }),
  ],
});

exports.setupStyles = paths => ({
  module: {
    loaders: [
      {
        test: /\.css$/,
        loaders: ['style', 'css'],
        include: paths,
      }, {
        test: /\.scss$/,
        loaders: ['style', 'css', 'postcss', 'sass'],
        include: paths,
      },
    ],
  },
});

exports.extractStyles = paths => ({
  module: {
    loaders: [
      // Extract CSS during build
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css'),
        include: paths,
      }, {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css!postcss!sass'),
        include: paths,
      },
    ],
  },
});
