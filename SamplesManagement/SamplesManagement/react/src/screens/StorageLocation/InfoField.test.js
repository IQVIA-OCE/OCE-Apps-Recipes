import React from 'react';
import renderer from 'react-test-renderer';
import InfoField from './InfoField';

describe('StorageLocation InfoField', () => {
  it('Should render InfoField component', () => {
    const tree = renderer.create(
      <InfoField
        label="label"
        text="text"
        style={{}}
      />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
