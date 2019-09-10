const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
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
      test: /\.css$/,
      use: [
        isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            modules: true,
          },
        }
      ],
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
      title: 'Comic Frontier Booth Map',
      inject: true,
    }),
    new FaviconsWebpackPlugin({
      logo: path.resolve(__dirname, 'assets/cf-booth-map.png'),
      outputPath: 'assets',
      cache: isDev,
      inject: true,
      favicons: {
        appName: 'cf-booth-map',
        appDescription: 'Comic Frontier Booth Map',
        background: '#1875d1',
        theme_color: '#fff',
      },
    }),
    new WorkboxPlugin.InjectManifest({
      swSrc: './src/serviceWorker.js',
      swDest: 'sw.js',
    }),
    new WebpackPwaManifest({
      name: 'Comic Frontier Booth Map',
      short_name: 'CF Map',
      background_color: '#1875d1',
      theme_color: '#fff',
      crossorigin: 'anonymous',
      start_url: '/',
      fingerprints: true,
      ios: true,
      inject: true,
      icons: [{
        src: path.resolve(__dirname, 'assets/cf-booth-map.png'),
        sizes: [96, 128, 192, 256, 384, 512],
      }],
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
}, isDev ? require('./webpack.config.dev') : require('./webpack.config.prod'));
