import React from 'react';
import Status from './Status';
import { render } from '@testing-library/react-native';

describe('Status', () => {
  it('Should render Status InProgress', () => {
    const { getByTestId } = render(
      <Status status={'InProgress'}/>
    );

    expect(getByTestId('Status')).toBeTruthy();
  });
});
