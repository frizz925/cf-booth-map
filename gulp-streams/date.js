const through = require('through2');

module.exports = () =>
  through.obj((chunk, encoding, done) => {
    const transformed = chunk.clone();
    const now = new Date().getTime().toString();
    transformed.contents = Buffer.from(now);
    done(null, transformed);
  });
