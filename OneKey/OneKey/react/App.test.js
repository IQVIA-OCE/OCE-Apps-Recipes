import React from 'react';
import App from './App';
import renderer from 'react-test-renderer';
import { databaseManager } from 'oce-apps-bridges';

jest.useFakeTimers();

const filterKeys = (state) => {
  if (state.routes) {
    return {
      ...state,
      routes: state.routes.map((route) => {
        const { key, ...others } = route;
        return filterKeys(others);
      }),
    };
  }
  return state;
};

describe('App', () => {
  beforeAll(() => {
    databaseManager.fetch = jest
      .fn()
      .mockResolvedValue({ records: [], done: true });
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should render properly', () => {
    const tree = renderer.create(<App />);
    const instance = tree.getInstance();
    const state = filterKeys(instance.state.nav);

    expect(state).toMatchSnapshot();
  });
});
