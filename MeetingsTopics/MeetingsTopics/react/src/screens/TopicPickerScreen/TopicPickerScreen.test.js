import React from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react-native';
import { store } from '../../store/store';
import { TopicPickerScreen } from './TopicPickerScreen';

const MockView = View;
jest.mock('@oce-apps/apollo-react-native/lib/module/components/PressableRipple', () =>
  jest.fn(({ children, ...props }) => (
    <MockView {...props}>{children}</MockView>
  ))
);
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
