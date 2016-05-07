const path = require('path');

const PATHS = {
  app: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'build'),
};

module.exports = {
  entry: {
    app: PATHS.app,
  },

  output: {
    path: PATHS.build,
    filename: 'scripts.js',
  },
};
