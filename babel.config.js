module.exports = function(api) {
  const plugins = [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { legacy: true }],
  ];
  if (api.env('development')) {
    plugins.push('react-hot-loader/babel');
  }

  return {
    babelrc: false,
    presets: [
      '@babel/preset-env',
      '@babel/preset-typescript',
      '@babel/preset-react',
    ],
    plugins: plugins,
  };
};
