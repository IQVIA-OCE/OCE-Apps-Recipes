import React from 'react';
import renderer from 'react-test-renderer';
import Status from './Status';

describe('Status', () => {
  it('Should render Status InProgress', () => {
    const tree = renderer
      .create(
        <Status status={'InProgress'}/>
      ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
