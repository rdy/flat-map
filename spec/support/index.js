function timeout(duration = 0) {
  return new Promise(resolve => setTimeout(resolve, duration));
}

function withUnhandledRejection() {
  let unhandledRejection;
  beforeEach(() => {
    unhandledRejection = jasmine.createSpy('unhandledRejection');
    if (!process.listeners('unhandledRejection').length) process.on('unhandledRejection', unhandledRejection);
  });

  afterEach(() => {
    process.removeListener(unhandledRejection, unhandledRejection);
  });
}

export {timeout, withUnhandledRejection};