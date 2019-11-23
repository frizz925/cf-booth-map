const tsConfigPaths = require('./tsconfig.json').compilerOptions.paths;
const moduleResolver = require.resolve('babel-plugin-module-resolver');
const moduleAliases = {};
Object.keys(tsConfigPaths).forEach(name => {
  const configPath = tsConfigPaths[name][0];
  const moduleName = name.substring(0, name.length - 2);
  const modulePath = './' + configPath.substring(0, configPath.length - 2);
  moduleAliases[moduleName] = modulePath;
});

module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-typescript',
    '@babel/preset-react',
  ],
  plugins: [
    [
      moduleResolver,
      {
        root: ['.'],
        alias: moduleAliases,
      },
    ],
  ],
};
