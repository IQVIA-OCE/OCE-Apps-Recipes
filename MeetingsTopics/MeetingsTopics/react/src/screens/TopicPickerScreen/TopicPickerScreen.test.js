import React from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react-native';
import { store } from '../../store/store';
import { TopicPickerScreen } from './TopicPickerScreen';

const MockView = View;
jest.mock('apollo-react-native/lib/module/components/TouchableRipple', () =>
  jest.fn(({ children, ...props }) => (
    <MockView {...props}>{children}</MockView>
  ))
);
jest.mock('../../../bridge/EnvironmentData/EnvironmentData.native', () => ({
  environment: {
    namespace: () => 'OCE__',
    sfApiVersion: () => '1',
    userID: () => '1',
    locale: () => '',
  },
}));
jest.mock('../../../bridge/Localization/localization.native', () => ({
  localized: (_, fallback) => fallback,
}));
jest.mock('../../api/topicsApi');
jest.mock('../../api/commonApi');

let mockIsToggled = false;
const mockToggle = jest.fn(() => (mockIsToggled = !mockIsToggled));
jest.mock('../../hooks/useToggle', () => ({
  useToggle: () => [mockIsToggled, mockToggle],
}));
jest.mock('../../utils/dateTimeFormat', () => ({
  formatDate: (date) => date,
}));

describe('TopicPickerScreen', () => {

  it('should display TopicPickerScreen', async () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <TopicPickerScreen />
      </Provider>
    );
    expect(getByTestId('loader-wrap')).toBeTruthy();
  });
});
