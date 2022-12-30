import React from 'react';
import { render } from '@testing-library/react-native';
import Header from './Header';

jest.mock('react-navigation', () => ({
  withNavigation: Component => props => (
    <Component navigation={{ navigate: jest.fn() }} {...props} />
  ),
  SafeAreaView: ({ children }) => <>{children}</>,
}));

describe('Header', () => {
  it('should render correctly', () => {
    const { getByText } = render(
      <Header onCancel={() => {}} onSave={() => {}} title="TestTitle" />
    );

    expect(getByText(/TestTitle/i)).toBeTruthy();
  })

  it('should render without arguments', () => {
    const { getByText } = render(
      <Header />
    );

    expect(getByText(/Save/i)).toBeTruthy();
  })
})
