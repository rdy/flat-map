const isStream = require('is-stream');
const through = require('through');
const Promise = require('any-promise');

function isPromise(obj) {
  return obj instanceof Promise;
}

function flatten(data) {
  if (Array.isArray(data)) return data.forEach(this.queue);
  if (isStream(data)) return new Promise((resolve, reject) => {
    let err;
    data.on('error', e => (err = e, reject(e))).pipe(through(this.queue, () => {
      if (err) return reject(err);
      resolve();
    }));
  });
  this.queue(data);
}

function flatMap(callback) {
  const promises = [];
  let index = 0;

  function pushPromise(data) {
    const result = this::flatten(data);
    if (isPromise(result)) promises.push(result);
  }

  return through(function(data) {
    callback(data, (err, data) => {
      if (err) this.emit('error', err);

      if (isPromise(data)) {
        this.pause();
        return data.then(this::pushPromise, err => this.emit('error', err)).then(this.resume, this.resume);
      }
      this::pushPromise(data);
    }, index++);
  }, function() {
    const end = () => this.queue(null);
    Promise.all(promises).then(end, end);
  });
}

module.exports = flatMap;