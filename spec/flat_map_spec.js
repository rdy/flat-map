require('./spec_helper');

describe('FlatMap', function() {
  let es, result, subject;
  beforeEach(function() {
    es = require('event-stream');
    subject = require('../src/flat-map');
  });

  function split(data, callback) {
    callback(null, data.split(/\s+/));
  }

  function splitStream(data, callback) {
    callback(null, es.readArray(data.split(/\s+/)));
  }

  async function buildStream(array, callback) {
    return new Promise((resolve, reject) => {
      es.readArray(array)
        .pipe(subject(callback))
        .pipe(es.writeArray((err, array) => {
          if (err) reject(err);
          resolve(array);
        }));
    });
  }

  describe('when the callback data is not an array', function() {
    beforeEach(async function(done) {
      result = await buildStream(['one', 'two'], split);
      done();
    });

    it('maps a flat stream', function() {
      expect(result).toEqual(['one', 'two']);
    });
  });

  describe('when the callback data returns an array', function() {
    beforeEach(async function(done) {
      result = await buildStream(['one two', 'three', 'four five'], split);
      done();
    });

    it('maps a flat stream', function() {
      expect(result).toEqual(['one', 'two', 'three', 'four', 'five']);
    });
  });

  describe('when the callback data returns a stream', function() {
    beforeEach(async function(done) {
      result = await buildStream(['one two', 'three', 'four five'], splitStream);
      done();
    });

    it('maps a flat stream', function() {
      expect(result).toEqual(['one', 'two', 'three', 'four', 'five']);
    });
  });

  describe('when the callback utilizes the count', () => {
    beforeEach(async function(done) {
      result = await buildStream(['one', 'two', 'three', 'four', 'five'], (data, callback, i) => callback(null, i));
      done();
    });

    it('maps the count', function() {
      expect(result).toEqual([0, 1, 2, 3, 4]);
    });
  });
});