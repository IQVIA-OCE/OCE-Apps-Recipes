import { render } from '@testing-library/react-native';
import React from 'react';
import { App } from './App';
import { CustomProgress } from './src/components/CustomProgress';
import { NotificationBanner } from './src/components/NotificationBanner';

describe('Application', () => {
  it('should render properly', () => {
    const { UNSAFE_getByType } = render(<App />);

    expect(UNSAFE_getByType(NotificationBanner)).toBeTruthy();
    expect(UNSAFE_getByType(CustomProgress)).toBeTruthy();
  });
});
