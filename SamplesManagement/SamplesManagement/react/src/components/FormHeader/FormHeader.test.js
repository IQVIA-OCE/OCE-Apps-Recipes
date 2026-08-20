import React from 'react';
import FormHeader from './FormHeader';
import { render } from '@testing-library/react-native';

describe('FormHeader', () => {
  it('Should render FormHeader', () => {
    const { getByText } = render(
      <FormHeader
        label="label"
        title="title"
        controls={[{ label: 'button' }]}
      />
    )

    expect(getByText(/LABEL/)).toBeTruthy();
    expect(getByText(/title/)).toBeTruthy();
    expect(getByText(/button/)).toBeTruthy();
  });
});
