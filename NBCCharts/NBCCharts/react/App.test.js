import React from 'react';
import App from './App';
import renderer from 'react-test-renderer';
import { _TESTING_ONLY_normalize_keys } from '@react-navigation/core/lib/commonjs/routers/KeyGenerator';

describe('App', () => {
  beforeEach(() => {
    _TESTING_ONLY_normalize_keys();
  });

  it('should render properly', () => {
    const tree = renderer.create(
      <App />
    );

    expect(tree).toMatchSnapshot();
  })

});
