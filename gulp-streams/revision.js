const crypto = require('crypto');
const through = require('through2');

const template = '{{ REVISION }}';

module.exports = () =>
  through.obj((chunk, encoding, done) => {
    const contents = chunk.contents.toString();
    const time = new Date().getTime().toString();
    const shasum = crypto.createHash('sha1');
    shasum.update(time);
    const hash = shasum.digest('hex');
    const result = contents.replace(new RegExp(template, 'g'), hash);
    const transformed = chunk.clone();
    transformed.contents = Buffer.from(result);
    done(null, transformed);
  });
