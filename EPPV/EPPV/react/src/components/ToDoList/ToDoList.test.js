import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { ToDoList } from './ToDoList';
import { TODO_IOS_NORMALIZED } from '../../constants';
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

jest.mock('@oce-apps/oce-apps-bridges', () => ({
  environment: {
    locale: () => 'en_US',
    timeZone: () => 'America/Los_Angeles',
    namespace: () => '',
    userID: () => '',
  },
  layoutBridge: {
    setHeight: jest.fn(),
  },
  localized: jest.fn(),
}));

describe('ToDo List', () => {
  it('should render properly', async () => {
    const { getAllByText,  getByTestId } = render(
      <ToDoList
        data={TODO_IOS_NORMALIZED}
        isLoading={false}
        loadMoreTodoData={() => jest.fn()}
        openCompleteForm={() => jest.fn()}
      />
    );

    const completeButton = getAllByText('Complete')[0];
    expect(completeButton).toBeTruthy();
    const todoList = getByTestId('todoList');
    
    await act(async () => {
      todoList.props.onEndReached();
      fireEvent(completeButton, 'press', { nativeEvent: {} });
    });
  });

  it('should render properly without data and with loading status', () => {
    const tree = render(
      <ToDoList
        data={[]}
        isLoading={true}
        loadMoreTodoData={() => jest.fn()}
        openCompleteForm={() => jest.fn()}
      />
    );
    expect(tree).toBeTruthy();
  });
});
