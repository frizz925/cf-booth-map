const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const HtmlBeautifyPlugin = require('html-beautify-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV || 'production';
const ASSET_PATH = process.env.ASSET_PATH || '/';

const isDev = NODE_ENV === 'development';
const webpackEnvConfig = isDev
  ? require('./webpack.config.dev')
  : require('./webpack.config.prod');

const staticUrlLoader = {
  loader: 'url-loader',
  options: {
    limit: 8092,
  },
};

const webpackConfig = {
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: ASSET_PATH,
    filename: isDev ? '[name].bundle.js' : '[name].[hash:8].js',
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        use: 'babel-loader',
        include: [path.resolve(__dirname, 'src')],
        exclude: [path.resolve(__dirname, 'node_modules')],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true,
            },
          },
        ],
        exclude: [path.resolve(__dirname, 'node_modules')],
      },
      {
        test: /\.css$/,
        use: [isDev ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader'],
        include: [path.resolve(__dirname, 'node_modules')],
      },
      {
        test: /\.(png|jpg|jpeg|webp|woff|woff2|eot|ttf)$/,
        use: isDev ? staticUrlLoader : 'file-loader',
      },
    ],
  },
  resolve: {
    modules: ['src', 'node_modules'],
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          name: 'vendors',
          chunks: 'initial',
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
        default: {
          chunks: 'all',
          priority: -20,
        },
      },
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: isDev ? '[name].bundle.css' : '[name].[hash:8].css',
      ignoreOrder: false,
    }),
    new CopyPlugin([
      { from: 'src/assets/modernizr-custom.js', to: 'js' },
      { from: 'src/css', to: 'css' },
      { from: 'src/data', to: 'data' },
    ]),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
      inject: 'head',
    }),
    new HtmlWebpackTagsPlugin({
      scripts: ['js/modernizr-custom.js'],
      links: ['css/main.css'],
    }),
    new HtmlBeautifyPlugin({
      replace: [' type="text/javascript"'],
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
      'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH),
    }),
  ],
};

module.exports = require('webpack-merge')(webpackConfig, webpackEnvConfig);
