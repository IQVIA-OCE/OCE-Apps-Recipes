import React from 'react';
import renderer from 'react-test-renderer';
import App from './App';

describe('Application', () => {
  it('should render properly', () => {
    const tree = renderer.create(
      <App />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  })
});
