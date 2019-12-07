const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  entry: ['react-hot-loader/patch', './src/index.ts'],
  devServer: {
    port: 3000,
    inline: true,
    contentBase: path.resolve(__dirname, 'dist'),
    historyApiFallback: true,
    hot: true,
  },
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
};
