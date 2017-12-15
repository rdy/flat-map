import isStream from 'is-stream';
import through from 'through';

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
  function flush() {
    stream.emit('end');
  }

  const stream = through(function(data) {
    callback(data, (err, data) => {
      if (err) return promises.push(Promise.reject(err));
      if (isPromise(data)) {
        return promises.push(
          data.then(this::flatten)
        );
      }

      const result = this::flatten(data);
      if (isPromise(result)) promises.push(result);
    }, index++, flush);
  }, function() {
    Promise.all(promises)
      .then(() => this.queue(null))
      .catch(err => {
        this.emit('error', err);
        this.queue(null);
      });
  });

  return stream;
}

export default flatMap;