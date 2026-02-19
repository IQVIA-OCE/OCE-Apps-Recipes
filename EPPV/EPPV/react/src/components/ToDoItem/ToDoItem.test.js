import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { DarkTheme, Provider } from '@oce-apps/apollo-react-native';
import { Platform } from 'react-native';
import * as helpers from '../../utils/common';
import { ToDoItem } from './ToDoItem';
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

jest.mock('@oce-apps/oce-apps-bridges', () => ({
  environment: {
    namespace: jest.fn(),
    locale: () => 'test',
  },
  layoutBridge: {
    setHeight: jest.fn(),
  },
  localized: jest.fn(),
}));

jest.mock('react-native/Libraries/Utilities/Platform', () => {
  let platform = {
    OS: 'ios',
  };

  const select = jest.fn().mockImplementation((obj) => {
    const value = obj[platform.OS];
    return !value ? obj.default : value;
  });

  platform.select = select;

  return platform;
});

const toDoItem = {};

describe('ToDo Item', () => {
  it('should render properly', () => {
    helpers.isIphone = false;
    const onComplete = jest.fn();

    const { getByText } = render(
      <ToDoItem item={toDoItem} onComplete={onComplete} index={1} />
    );

    const completeButton = getByText('Complete');
    expect(completeButton).toBeTruthy();

    fireEvent(completeButton, 'press', { nativeEvent: {} });
  });

  it('should render properly on iPhone', () => {
    helpers.isIphone = true;

    const tree = render(
      <ToDoItem item={toDoItem} onComplete={() => {}} index={1} />
    );
    expect(tree).toBeTruthy();
  });

  it('should render properly in Dark Mode', () => {
    helpers.isIphone = false;

    const tree = render(
      <Provider theme={DarkTheme}>
        <ToDoItem item={toDoItem} onComplete={() => {}} index={1} />
      </Provider>
    );
    expect(tree).toBeTruthy();
  });

  it('should render properly in Dark Mode onIphone', () => {
    helpers.isIphone = true;

    const tree = render(
      <Provider theme={DarkTheme}>
        <ToDoItem item={toDoItem} onComplete={() => {}} index={1} />
      </Provider>
    );
    expect(tree).toBeTruthy();
  });

  it('should render properly on Web', async () => {
    Platform.OS = 'web';

    const { getByTestId } = render(
      <ToDoItem item={toDoItem} onComplete={() => {}} index={1} />
    );

    const completeWebButton = await getByTestId('complete_web_button');
    expect(completeWebButton).toBeTruthy();

    fireEvent(completeWebButton, 'press', { nativeEvent: {} });
  });
});
