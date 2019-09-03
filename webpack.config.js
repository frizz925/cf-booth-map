const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  devtool: 'inline-source-map',
  mode: isDev ? 'development' : 'production',
  entry: './src/index.tsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    hot: true,
    port: 3000,
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      exclude: /node_modules/,
      use: 'ts-loader',
    }, {
      test: /\.css$/,
      use: [
        isDev ? 'style-loader' : MiniCssExtractPlugin,
        'css-loader',
      ],
    }, {
      test: /\.(svg|png|jpg|jpeg|gif)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 8192,
        },
      },
    }],
  },
  resolve: {
    modules: ['src', 'node_modules'],
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      chunksSortMode: 'dependency',
      inject: true,
    }),
  ],
};
