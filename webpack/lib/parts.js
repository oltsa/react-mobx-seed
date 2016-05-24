const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

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

exports.minify = () => ({
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        dead_code: true,
        unused: true,
        drop_console: true,
      },
    }),
  ],
});

exports.setFreeVariable = (key, value) => {
  const env = {};
  env[key] = JSON.stringify(value);

  return {
    plugins: [
      new webpack.DefinePlugin(env),
    ],
  };
};

exports.extractBundle = options => {
  const entry = {};
  entry[options.name] = options.entries;

  return {
    entry,
    plugins: [
      new webpack.optimize.CommonsChunkPlugin({
        names: [options.name, 'manifest'],
        minChunks: Infinity,
      }),
    ],
  };
};

exports.clean = path => ({
  plugins: [
    new CleanWebpackPlugin([path], {
      root: process.cwd(),
    }),
  ],
});
