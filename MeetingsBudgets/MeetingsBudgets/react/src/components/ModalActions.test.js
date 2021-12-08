import React from 'react';
import { render } from '@testing-library/react-native';
import { ModalActions} from './ModalActions';

jest.mock('../../bridge/Localization/localization.native', () => ({
  localized: (_, fallback) => fallback,
}));

describe('ModalActions', () => {
  it('should render correctly', () => {
    const onCancel = jest.fn();
    const onSave = jest.fn();

    const { getByText } = render(
      <ModalActions onCancel={onCancel} onSave={onSave}/>
    );

    expect(getByText(/Cancel/i)).toBeTruthy();
    expect(getByText(/Save/i)).toBeTruthy();
  });
});
