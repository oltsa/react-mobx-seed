const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      inject: false,
      template: 'node_modules/html-webpack-template/index.ejs',
      appMountId: 'app',
      title: 'React Mobx Seed / Boilerplate',
    }),
  ],
};
