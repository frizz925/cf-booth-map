const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OfflinePlugin = require('offline-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const CI = process.env.CI === 'true';

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  optimization: {
    minimizer: [new TerserJSPlugin(), new OptimizeCSSAssetsPlugin()],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new OfflinePlugin(),
    !CI ? new BundleAnalyzerPlugin() : null,
  ].filter(Boolean),
};
