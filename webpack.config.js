const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlBeautifyPlugin = require('html-beautify-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV || 'production';
const ASSET_PATH = process.env.ASSET_PATH || '/';
const APP_VERSION = process.env.APP_VERSION;

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
const styleLoader = isDev ? 'style-loader' : MiniCssExtractPlugin.loader;
const cssModuleLoader = {
  loader: 'css-loader',
  options: {
    importLoaders: 1,
    modules: true,
  },
};
const sassLoader = {
  loader: 'sass-loader',
  options: {
    sassOptions: {
      sourceMap: isDev,
      includePaths: ['./node_modules', './src/scss'],
    },
  },
};

const cssModulePaths = [
  path.resolve(__dirname, 'src/components'),
  path.resolve(__dirname, 'src/containers'),
  path.resolve(__dirname, 'src/pages'),
];

const cssInlinePaths = [
  /*
  path.resolve(__dirname, 'src/css'),
  path.resolve(__dirname, 'src/scss'),
  */
];

const cdnCacheOptions = cacheName => ({
  cacheName,
  cacheableResponse: {
    statuses: [0, 200],
  },
});

const webpackConfig = {
  entry: {
    main: './src/index.ts',
  },
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
        test: /\.s[ca]ss$/,
        use: ['style-loader', cssModuleLoader, sassLoader],
        include: cssModulePaths,
      },
      {
        test: /\.s[ca]ss$/,
        use: ['style-loader', 'css-loader', sassLoader],
        include: cssInlinePaths,
      },
      {
        test: /\.s[ca]ss$/,
        use: [styleLoader, 'css-loader', sassLoader],
        exclude: [].concat(cssInlinePaths, cssModulePaths),
      },
      {
        test: /\.css$/,
        use: ['style-loader', cssModuleLoader],
        include: cssModulePaths,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        include: cssInlinePaths,
      },
      {
        test: /\.css$/,
        use: [styleLoader, 'css-loader'],
        exclude: [].concat(cssInlinePaths, cssModulePaths),
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      },
      {
        test: /\.md$/,
        use: ['html-loader', 'markdown-loader'],
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
  externals: {
    lodash: '_',
    localforage: 'localforage',
    hammerjs: 'Hammer',
    rxjs: 'rxjs',
    'rxjs/operators': 'rxjs.operators',
    'fuse.js': 'Fuse',
    'pixi.js': 'PIXI',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    runtimeChunk: true,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: isDev ? '[name].bundle.css' : '[name].[hash:8].css',
      ignoreOrder: false,
    }),
    new CopyPlugin([
      { from: 'assets', to: 'assets' },
      { from: 'src/data', to: 'data' },
      { from: 'src/assets/modernizr-custom.js', to: 'js' },
      { from: 'src/manifest.json', to: 'manifest.json' },
    ]),
    new WorkboxPlugin.GenerateSW({
      swDest: 'sw.js',
      clientsClaim: true,
      skipWaiting: true,
      runtimeCaching: [
        {
          urlPattern: /\/$/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'index-cache',
          },
        },
        {
          urlPattern: new RegExp('^https://unpkg\\.com/'),
          handler: 'CacheFirst',
          options: cdnCacheOptions('unpkg-cache'),
        },
        {
          urlPattern: new RegExp('^https://cdnjs\\.cloudflare\\.com/'),
          handler: 'CacheFirst',
          options: cdnCacheOptions('cdnjs-cache'),
        },
        {
          urlPattern: new RegExp('^https://.+\\.googleapis\\.com/'),
          handler: 'CacheFirst',
          options: cdnCacheOptions('google-cache'),
        },
        {
          urlPattern: new RegExp('^https://catalog\\.comifuro\\.net/'),
          handler: 'CacheFirst',
          options: cdnCacheOptions('comifuro-cache'),
        },
      ],
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.ejs',
      inject: false,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
      'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH),
      'process.env.APP_VERSION': JSON.stringify(APP_VERSION),
    }),
  ],
};

const webpackOverrideConfig = {
  plugins: [
    new HtmlBeautifyPlugin({
      replace: [' type="text/javascript"'],
    }),
  ],
};

module.exports = require('webpack-merge')(
  webpackConfig,
  webpackEnvConfig,
  webpackOverrideConfig,
);
