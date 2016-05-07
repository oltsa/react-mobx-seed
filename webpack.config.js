const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const TARGET = process.env.npm_lifecycle_event;

const PATHS = {
  app: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'build'),
};

const common = {
  entry: {
    app: PATHS.app,
  },

  output: {
    path: PATHS.build,
    filename: 'app.js',
  },
  resolve: {
    extension: ['', '.js', '.jsx'],
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel?cacheDirectory'],
        include: PATHS.app,
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css'],
        include: PATHS.app,
      },
    ],
  },
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
      }),
    ],
  });
}

if (TARGET === 'build') {
  module.exports = merge(common, {});
}

