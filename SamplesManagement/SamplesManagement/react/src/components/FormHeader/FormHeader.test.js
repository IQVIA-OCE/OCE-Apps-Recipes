import React from 'react';
import renderer from 'react-test-renderer';
import FormHeader from './FormHeader';

describe('FormHeader', () => {
  it('Should render FormHeader', () => {
    const tree = renderer
      .create(
        <FormHeader
          label="label"
          title="title"
          controls={[{ label: 'button' }]}
        />
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
