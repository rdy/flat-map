const isStream = require('is-stream');
const pipe = require('multipipe');
const through = require('through');
const Promise = require('any-promise');

function isPromise(obj) {
  return obj instanceof Promise;
}

function flatten(data) {
  if (Array.isArray(data)) return data.forEach(this.queue);
  if (isStream(data)) return new Promise((resolve, reject) => {
    pipe(
      data,
      through(this.queue, resolve),
      (err) => err && reject(err)
    );
  });
  this.queue(data);
}

function flatMap(callback) {
  const promises = [];
  let index = 0;

  function pushPromise(data) {
    const result = this::flatten(data);
    if (isPromise(result)) return promises.push(result);
  }

  return through(function(data) {
    callback(data, (err, data) => {
      if (err) return this.emit('error', err);
      if (isPromise(data)) {
        this.pause();
        return data.then(this::pushPromise, err => this.emit('error', err)).then(this.resume, this.resume);
      }
      this::pushPromise(data);
    }, index++);
  }, function() {
    Promise.all(promises).then(() => this.queue(null));
  });
}

module.exports = flatMap;