const tsConfigPaths = require('./tsconfig.json').compilerOptions.paths;
const moduleNameMapper = {};
Object.keys(tsConfigPaths).forEach((key) => {
  const configPath = tsConfigPaths[key][0];
  const modulePath = '<rootDir>/' + configPath.replace('*', '$1');
  const moduleName = key.replace('*', '(.*)');
  moduleNameMapper[moduleName] = modulePath;
});

module.exports = {
  roots: [
    '<rootDir>/src'
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper,
};
