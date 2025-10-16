import React from 'react';
import { render } from '@testing-library/react-native';
import { ModalActions } from './ModalActions';

describe('ModalActions', () => {
  it('should render correctly', () => {
    const onCancel = jest.fn();

    const { getByText } = render(
      <ModalActions onCancel={onCancel} />
    );

    expect(getByText(/Save/i)).toBeTruthy();
  });
});
