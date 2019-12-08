const webpack = require('webpack');

module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  entry: {
    main: ['react-hot-loader/patch', './src/index.ts'],
  },
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
};
