const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  entry: {
    app: ['react-hot-loader/patch', './src/app.tsx'],
  },
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
