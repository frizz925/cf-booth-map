const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  optimization: {
    splitChunks: {
      minSize: 10000,
      maxSize: 250000,
    },
    minimizer: [
      new TerserPlugin(),
    ],
  },
};
