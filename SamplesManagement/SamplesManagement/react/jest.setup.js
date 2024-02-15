global.Promise = jest.requireActual('promise');

beforeEach(() => {
  jest.useFakeTimers({ advanceTimers: true })
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});
