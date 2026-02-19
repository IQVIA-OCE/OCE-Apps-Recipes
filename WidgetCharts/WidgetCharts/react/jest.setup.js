import '@testing-library/jest-native/extend-expect';

global.beforeEach(function () {
  jest.useFakeTimers({ advanceTimers: true });
});

global.afterEach(function () {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

global.Promise = jest.requireActual('promise');

jest.setTimeout(20_000);
