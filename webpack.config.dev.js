const webpack = require('webpack');

module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
};
