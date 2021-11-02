import React from 'react';
import { render } from '@testing-library/react-native';
import { SpeakerModalActions } from './SpeakerModalActions';

jest.mock('../../../../../bridge/Localization/localization.native', () => ({
  localized: (_, fallback) => fallback,
}));

describe('SpeakerModalActions', () => {
  it('should render correctly', () => {
    const onSave = jest.fn();

    const { getByText } = render(<SpeakerModalActions onSave={onSave} />);

    expect(getByText(/Save/i)).toBeTruthy();
  });
});
