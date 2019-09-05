const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
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
      test: /\.(js|ts)x?$/,
      exclude: /node_modules/,
      use: 'babel-loader',
    }, {
      test: /\.css$/,
      use: [
        isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
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
    new webpack.DefinePlugin({
      'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      chunksSortMode: 'dependency',
      inject: true,
    }),
    new MiniCssExtractPlugin({
      filename: isDev ? '[name].css' : '[name].[hash:8].css',
      chunkFilename: isDev ? '[id].css' : '[id].[hash:8].css',
      ignoreOrder: false,
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
}, isDev ? require('./webpack.config.dev') : require('./webpack.config.prod'));
