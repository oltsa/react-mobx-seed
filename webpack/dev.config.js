const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      inject: false,
      template: 'templates/index.ejs',
      appMountId: 'app',
      title: 'React Mobx Seed / Boilerplate',
    }),
  ],
};
