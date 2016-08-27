const isStream = require('is-stream');
const through = require('through');
const Promise = require('any-promise');

function isPromise(obj) {
  return obj.then;
}

function flatten(data) {
  if (isStream(data)) {
    return new Promise((resolve, reject) => {
      let err;
      data.on('error', e => (err = e, reject(e))).pipe(through(this.queue, () => {
        if (err) return reject(err);
        resolve(data);
      }));
    });
  }
  if (Array.isArray(data)) {
    data.forEach(this.queue);
  } else {
    this.queue(data);
  }
  return data;
}

function flatMap(callback) {
  const promises = [];
  let index = 0;

  return through(function(data) {
    callback(data, (err, data) => {
      if (err) this.emit('error', err);
      if (isPromise(data)) return promises.push(data.then(this::flatten, err => this.emit('error', err)));
      const result = this::flatten(data);
      if (isPromise(result)) promises.push(result);
    }, index++);
  }, function() {
    const end = () => this.queue(null);
    Promise.all(promises).then(end, end);
  });
}

module.exports = flatMap;