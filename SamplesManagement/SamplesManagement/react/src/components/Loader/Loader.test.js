import renderer from 'react-test-renderer';
import Loader from './Loader';
import React from 'react';

describe('Loader', () => {
  it('Should render Loader', () => {
    const tree = renderer.create(<Loader />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
