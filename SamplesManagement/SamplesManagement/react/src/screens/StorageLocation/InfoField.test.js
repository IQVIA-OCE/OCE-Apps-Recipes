import React from 'react';
import InfoField from './InfoField';
import { render } from '@testing-library/react-native';

describe('StorageLocation InfoField', () => {
  it('Should render InfoField component', () => {
    const { getByText } = render(
      <InfoField
        label="label"
        text="text"
        style={{}}
      />
    );

    expect(getByText('label')).toBeTruthy();
    expect(getByText('text')).toBeTruthy();
  });
});
