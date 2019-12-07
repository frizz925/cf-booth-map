const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const DynamicCdnWebpackPlugin = require('dynamic-cdn-webpack-plugin');

const ANALYZE_BUNDLE = process.env.ANALYZE_BUNDLE === 'true';

module.exports = {
  mode: 'production',
  optimization: {
    minimizer: [new TerserJSPlugin(), new OptimizeCSSAssetsPlugin()],
  },
  plugins: [
    new DynamicCdnWebpackPlugin({
      exclude: ['react-router-dom'],
    }),
    new CleanWebpackPlugin(),
    ANALYZE_BUNDLE ? new BundleAnalyzerPlugin() : null,
  ].filter(Boolean),
};
