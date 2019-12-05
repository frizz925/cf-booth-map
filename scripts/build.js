#!/usr/bin/env node
const path = require('path');
const git = require('simple-git');
const webpack = require('webpack');
const repoPath = path.resolve(__dirname, '..');
const zeropad = text => {
  if (typeof text !== 'string') {
    text = text.toString();
  }
  return ('00' + text).substring(text.length);
};

git(repoPath).revparse(['HEAD'], (err, hash) => {
  if (err) {
    console.error(err);
    return;
  }
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = zeropad(now.getUTCMonth() + 1);
  const date = zeropad(now.getUTCDate());
  const shortHash = hash.substring(0, 7);
  process.env.APP_VERSION = `v${year}${month}${date}-${shortHash}`;

  webpack(require('../webpack.config')).run((err, stats) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(
      stats.toString({
        colors: true,
      }),
    );
  });
});
