const cwd = process.cwd();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const through = require('through2');

const prefix = '{{ REVISION ';
const suffix = ' }}';

const getRevisions = (keys, cb) => {
  let counter = 0;
  const result = {};
  keys.forEach(key => {
    const shasum = crypto.createHash('sha1');
    const s = fs.ReadStream(path.resolve(cwd, key));
    s.on('data', data => shasum.update(data));
    s.on('end', () => {
      result[key] = shasum.digest('hex');
      if (++counter >= keys.length) {
        cb(result);
      }
    });
  });
};

const evaluate = content => {
  const result = {};
  let index = 0;
  while (index >= 0) {
    index = content.indexOf(prefix, index);
    if (index < 0) {
      break;
    }
    const endIndex = content.indexOf(suffix, index);
    const key = content.substring(index + prefix.length, endIndex);
    if (!result[key]) {
      const template = content.substring(index, endIndex + suffix.length);
      result[key] = (text, rev) => text.replace(new RegExp(template, 'g'), rev);
    }
    index = endIndex;
  }
  return result;
};

module.exports = () =>
  through.obj((chunk, encoding, done) => {
    const transformed = chunk.clone();
    let contents = transformed.contents.toString();
    const replacers = evaluate(contents);
    const keys = Object.keys(replacers);
    getRevisions(keys, revs => {
      keys.forEach(key => {
        const replacer = replacers[key];
        const rev = revs[key];
        contents = replacer(contents, rev);
      });
      transformed.contents = Buffer.from(contents);
      done(null, transformed);
    });
  });
