const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new HtmlWebpackPlugin({
      inject: false,
      template: 'templates/index.ejs',
      appMountId: 'app',
      title: 'React Mobx Seed - Easy Boilerplate',
    }),
  ],
};
