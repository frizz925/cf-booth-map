const tsConfigPaths = require('./tsconfig.json')
  .compilerOptions
  .paths;
const moduleAliases = {};
Object.keys(tsConfigPaths).forEach(key => {
  if (key.indexOf('/*') <= 0) {
    return;
  }
  const alias = key.replace('/*', '');
  const path = tsConfigPaths[key][0]
    .replace('/*', '');
  moduleAliases[alias] = './' + path;
});

module.exports = function(api) {
  const plugins = [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { legacy: true }],
    '@babel/plugin-syntax-dynamic-import',
    [
      'babel-plugin-module-resolver',
      {
        root: ['.'],
        alias: moduleAliases,
      }
    ],
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
