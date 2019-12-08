const through = require('through2');

module.exports = version =>
  through.obj((chunk, encoding, done) => {
    const transformed = chunk.clone();
    version((err, result) => {
      if (err) {
        done(err, null);
        return;
      }
      transformed.contents = Buffer.from(result);
      done(null, transformed);
    });
  });
