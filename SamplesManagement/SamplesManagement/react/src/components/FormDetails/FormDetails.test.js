import renderer from 'react-test-renderer';
import FormDetails from './FormDetails';
import React from 'react';
import { Text } from 'react-native';

describe('FormDetails', () => {
  it('Should render FormDetails ', () => {
    const tree = renderer
      .create(
        <FormDetails title="title">
          <Text>Text</Text>
        </FormDetails>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
