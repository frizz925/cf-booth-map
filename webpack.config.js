const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const isDev = process.env.NODE_ENV === 'development';

module.exports = merge({
  entry: {
    main: './src/index.tsx',
  },
  output: {
    filename: isDev ? '[name].bundle.js' : '[name].[hash:8].js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [{
      test: /\.(j|t)sx?$/,
      exclude: /node_modules/,
      use: 'babel-loader',
    }, {
      test: /\.(svg|png|jpg|jpeg|gif|woff|woff2|ttf|eot)$/,
      use: isDev ? {
        loader: 'url-loader',
        options: {
          limit: 8192,
        },
      } : 'file-loader',
    }],
  },
  resolve: {
    modules: ['src', 'node_modules'],
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
  plugins: [
    new webpack.DefinePlugin({
      'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      chunksSortMode: 'dependency',
      inject: true,
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
}, isDev ? require('./webpack.config.dev') : require('./webpack.config.prod'));
