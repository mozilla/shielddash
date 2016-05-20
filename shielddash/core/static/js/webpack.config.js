var path = require('path');

module.exports = {
  entry: './shielddash/core/static/js/app/app.js',
  output: {
    filename: './shielddash/core/static/js/bundle.js',
    sourceMapFilename: './shielddash/core/static/js/bundle.map'
  },
  devtool: '#source-map',
  module: {
    loaders: [
      {
        loader: 'babel',
        exclude: /node_modules/
      }
    ]
  }
};
