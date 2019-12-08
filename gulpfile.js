const path = require('path');
const { task, watch, series, parallel, src, dest } = require('gulp');
const babel = require('gulp-babel');
const log = require('fancy-log');
const PluginError = require('plugin-error');

const git = require('simple-git');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const date = require('./gulp-streams/date');
const hash = require('./gulp-streams/hash');
const version = require('./gulp-streams/version');

const getVersion = cb => {
  git(__dirname).revparse(['HEAD'], (err, hash) => {
    if (err) {
      cb(err, null);
      return;
    }

    const now = new Date();
    const year = now.getUTCFullYear();
    const month = zeropad(now.getUTCMonth() + 1);
    const date = zeropad(now.getUTCDate());
    const shortHash = hash.substring(0, 8);
    const result = `v${year}${month}${date}-${shortHash}`;
    cb(null, result);
  });
};

const webpackCompiler = cb => {
  getVersion((err, result) => {
    if (err) {
      cb(err, null);
      return;
    }
    process.env.APP_VERSION = result;
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
    .pipe(babel())
    .pipe(dest('staging')),
);

task('sw:watch', () => {
  watch('src/sw.js', series('sw'));
});

task('version', () =>
  src('src/api/version')
    .pipe(version(getVersion))
    .pipe(dest('staging')),
);

task('revision', () =>
  src('src/api/revision')
    .pipe(date())
    .pipe(hash())
    .pipe(dest('staging')),
);

task('staging', parallel('sw', 'version', 'revision'));

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

task('build', series('staging', 'webpack'));
task('dev', series('staging', parallel('sw:watch', 'webpack:dev-server')));

task('default', series('build'));
