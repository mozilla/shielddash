var path = require('path');
var webpack = require('webpack');

var definePlugin = new webpack.DefinePlugin({
  __PROD_API__: JSON.stringify(JSON.parse(process.env.PROD_API || 'false')),
});


module.exports = {
  entry: './shielddash/core/static/js/app/app.js',
  output: {
    filename: './shielddash/core/static/js/bundle.js',
    sourceMapFilename: './shielddash/core/static/js/bundle.map'
  },
  devtool: '#source-map',
  plugins: [definePlugin],
  module: {
    loaders: [
      {
        loader: 'babel',
        exclude: /node_modules/
      }
    ]
  }
};
