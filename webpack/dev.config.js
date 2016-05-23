const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PATHS = {
  app: path.join(__dirname, '../src'),
  build: path.join(__dirname, '../build'),
};

module.exports = {
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
  module: {
    loaders: [
      {
        test: /\.css$/,
        loaders: ['style', 'css'],
        include: PATHS.app,
      }, {
        test: /\.scss$/,
        loaders: ['style', 'css', 'postcss', 'sass'],
        include: PATHS.app,
      },
    ],
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
};
