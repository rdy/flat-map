const JasmineAsyncSuite = require('jasmine-async-suite');

JasmineAsyncSuite.install();

function timeout(duration = 0) {
  return new Promise(resolve => setTimeout(resolve, duration));
}

const globals = {timeout};
Object.assign(global, globals);

afterAll(() => {
  Object.keys(globals).forEach(key => delete global[key]);
  JasmineAsyncSuite.uninstall();
  delete require.cache[__filename];
});