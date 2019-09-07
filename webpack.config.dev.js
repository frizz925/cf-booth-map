const path = require('path');

module.exports = {
  devtool: 'inline-source-map',
  mode: 'development',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    hot: true,
    host: process.env.HOST || 'localhost',
    port: 3000,
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    }],
  },
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
};
