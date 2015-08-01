var isArray = require('lodash.isarray');
var isStream = require('isstream');
var through = require('through');

function flatMap(callback) {
  var streams = [];
  return through(function(data) {
    callback(data, (err, data) => {
      if (err) return this.emit('error', err);
      if (isArray(data)) return data.forEach(this.queue);
      if (isStream(data)) return streams.push(new Promise(resolve => data.pipe(through(this.queue, () => resolve()))));
      this.queue(data);
    });
  }, async function() {
    await* streams;
    this.emit('end');
  });
}

module.exports = flatMap;