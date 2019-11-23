const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const isDev = process.env.NODE_ENV === 'development';
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
  entry: {
    main: './src/index.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
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
        include: [path.resolve(__dirname, 'src/@components')],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        exclude: [path.resolve(__dirname, 'src/@components')],
      },
      {
        test: /\.(png|jpg|jpeg|woff|woff2|eot|ttf)$/,
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
      chunks: 'all',
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
    }),
  ],
};

module.exports = require('webpack-merge')(webpackConfig, webpackEnvConfig);
