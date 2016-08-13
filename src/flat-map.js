const isStream = require('is-stream');
const through = require('through');

function flatMap(callback) {
  const streams = [];
  let index = 0;
  return through(function(data) {
    callback(data, (err, data) => {
      if (err) return this.emit('error', err);
      if (Array.isArray(data)) return data.forEach(this.queue);
      if (isStream(data)) return streams.push(new Promise(resolve => data.pipe(through(this.queue, () => resolve()))));
      this.queue(data);
    }, index++);
  }, function() {
    Promise.all(streams).then(() => this.queue(null));
  });
}

module.exports = flatMap;