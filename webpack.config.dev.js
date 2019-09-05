const path = require('path');

module.exports = {
  devtool: 'inline-source-map',
  mode: 'development',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    hot: true,
    host: '0.0.0.0',
    port: 3000,
  },
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
};
