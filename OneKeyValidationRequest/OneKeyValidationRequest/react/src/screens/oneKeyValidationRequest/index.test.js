import React from 'react';
import renderer from 'react-test-renderer';
import OneKeyValidationRequest from './index'

describe('OneKeyValidationRequest', () => {
  it('Should render OneKeyValidationRequest component', () => {
    const tree = renderer
      .create(
        <OneKeyValidationRequest navigation={{ getParam: jest.fn() }}/>
      ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
