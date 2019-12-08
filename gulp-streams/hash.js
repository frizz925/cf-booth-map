const crypto = require('crypto');
const through = require('through2');

module.exports = () =>
  through.obj((chunk, encoding, done) => {
    const transformed = chunk.clone();
    const shasum = crypto.createHash('sha1');
    shasum.update(transformed.contents);
    const hash = shasum.digest('hex');
    transformed.contents = Buffer.from(hash);
    done(null, transformed);
  });
