import FormDetails from './FormDetails';
import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';

describe('FormDetails', () => {
  it('Should render FormDetails ', () => {
    const { getByTestId } = render(
      <FormDetails title="title">
        <Text>Text</Text>
      </FormDetails>
    );

    expect(getByTestId('FormDetails')).toBeTruthy();
  });
});
