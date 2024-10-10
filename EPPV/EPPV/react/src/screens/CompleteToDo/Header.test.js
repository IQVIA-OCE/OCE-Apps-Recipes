import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { DarkTheme, Provider } from '@oce-apps/apollo-react-native';
import { Header } from './Header';
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: jest.fn(),
    navigate: jest.fn(),
  }),
  useRoute: jest.fn().mockReturnValue({ refreshToDoList: true }),
  useFocusEffect: jest.fn(),
}));

describe('Header for CompleteToDo screen', () => {
  it('should render properly', async () => {
    const { getByTestId } = render(
      <Header onComplete={() => jest.fn()} isSubmitting={false} />
    );
    const completeButton = await getByTestId('completeButton');
    expect(completeButton).toBeTruthy();
    fireEvent(completeButton, 'press', { nativeEvent: {} });

    const headerBackButton = await getByTestId('headerBackButton');
    expect(headerBackButton).toBeTruthy();
    fireEvent(headerBackButton, 'press', { nativeEvent: {} });
  });

  it('should render properly in Dark Mode with Submitting status', async () => {
    const tree = render(
      <Provider theme={DarkTheme}>
        <Header onComplete={() => jest.fn()} isSubmitting={true} />
      </Provider>
    );
    expect(tree).toBeTruthy();
  });
});
