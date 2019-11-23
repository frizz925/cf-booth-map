const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    port: 3000,
    inline: true,
    contentBase: path.resolve(__dirname, 'dist'),
  },
};
