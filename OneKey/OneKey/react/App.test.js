import React from 'react';
import App from './App';
import renderer from 'react-test-renderer';
import { databaseManager } from 'oce-apps-bridges';
import { _TESTING_ONLY_normalize_keys } from '@react-navigation/core/lib/commonjs/routers/KeyGenerator';

jest.useFakeTimers();


describe('App', () => {
  beforeAll(() => {
    databaseManager.fetch = jest
      .fn()
      .mockResolvedValue({ records: [], done: true });
  });
  beforeEach(() => {
    jest.useFakeTimers();
    _TESTING_ONLY_normalize_keys();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should render properly', () => {
    const tree = renderer
      .create(<App />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
