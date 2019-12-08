const path = require('path');
const { task, watch, series, parallel, src, dest } = require('gulp');
const babel = require('gulp-babel');
const revision = require('./gulp-streams/revision');
const log = require('fancy-log');
const PluginError = require('plugin-error');

const git = require('simple-git');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackCompiler = cb => {
  git(__dirname).revparse(['HEAD'], (err, hash) => {
    if (err) {
      cb(err, null);
    }

    const now = new Date();
    const year = now.getUTCFullYear();
    const month = zeropad(now.getUTCMonth() + 1);
    const date = zeropad(now.getUTCDate());
    const shortHash = hash.substring(0, 7);

    process.env.APP_VERSION = `v${year}${month}${date}-${shortHash}`;

    const compiler = webpack(require('./webpack.config'));
    cb(null, compiler);
  });
};

const zeropad = text => {
  if (typeof text !== 'string') {
    text = text.toString();
  }
  return ('00' + text).substring(text.length);
};

task('sw', () =>
  src('src/sw.js')
    .pipe(revision())
    .pipe(babel())
    .pipe(dest('staging')),
);

task('sw:watch', () => {
  watch('src/sw.js', series('sw'));
});

task('webpack', cb => {
  const webpackCb = (err, stats) => {
    if (err) {
      cb(new PluginError('webpack', err));
      return;
    }
    const outputs = stats.toString({ colors: true });
    log(outputs);
    cb();
  };

  webpackCompiler((err, compiler) => {
    if (err) {
      cb(new PluginError('webpack', err));
      return;
    }
    compiler.run(webpackCb);
  });
});

task('webpack:dev-server', cb => {
  const start = server => {
    const port = 3000;
    server.listen(port, err => {
      if (err) {
        cb(new PluginError('webpack:dev-server', err));
        return;
      }
    });
  };

  webpackCompiler((err, compiler) => {
    if (err) {
      cb(new PluginError('webpack:dev-server', err));
      return;
    }
    const server = new WebpackDevServer(compiler, {
      inline: true,
      contentBase: path.resolve(__dirname, 'dist'),
      historyApiFallback: true,
      hot: true,
    });
    start(server);
  });
});

task('build', series('sw', 'webpack'));
task('dev', series('sw', parallel('sw:watch', 'webpack:dev-server')));

task('default', series('build'));
