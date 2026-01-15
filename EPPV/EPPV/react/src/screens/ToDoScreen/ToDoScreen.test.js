import React from 'react';
import { act, render, waitFor, fireEvent } from '@testing-library/react-native';
import { DarkTheme, Provider, Select } from '@oce-apps/apollo-react-native';
import { Platform } from 'react-native';
import { ToDoScreen } from './ToDoScreen';
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
import {
  fetchToDo,
  fetchByQueryLocator,
  fetchComplianceMetadata,
} from '../../api';
import * as helpers from '../../utils/common';

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

jest.mock('../../api', () => ({
  fetchToDo: jest.fn(),
  fetchComplianceMetadata: jest.fn(),
  fetchByQueryLocator: jest.fn(),
}));

jest.mock('@oce-apps/oce-apps-bridges', () => ({
  environment: {
    namespace: () => 'OCE__',
    locale: () => 'test',
  },
}));
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => jest.fn(),
  useRoute: jest.fn().mockReturnValue({ refreshToDoList: true }),
  useFocusEffect: jest.fn(),
}));

describe('ToDo screen', () => {
  beforeEach(() => {
    fetchComplianceMetadata.mockReturnValue({
      fields: [
        {
          name: 'OCE__ComplianceType__c',
          picklistValues: [{ active: true, value: 'EPPV', label: 'EPPV' }],
        },
      ],
    });
    fetchToDo.mockReturnValue({
      done: false,
      queryLocator: 'queryLocatorValue',
      records: [],
    });
    fetchByQueryLocator.mockReturnValue({
      done: true,
      queryLocator: null,
      records: [],
    });
  });

  it('should render properly', async () => {
    fetchToDo.mockReturnValue({
      done: true,
      queryLocator: '',
      records: [],
    });

    const promise = Promise.resolve();
    const { getByTestId } = await waitFor(() => render(<ToDoScreen />));
    await act(() => promise);

    const sortIcon = await getByTestId('sortIcon');
    const sortColumn = await getByTestId('sortColumnWrapper').findByType(
      Select
    );

    await act(async () => {
      fireEvent(sortIcon, 'press', { nativeEvent: {} });
      fireEvent(sortColumn, 'change', {
        nativeEvent: {
          label: 'Compliance',
          value: 'OCE__AccountCompliance__r.OCE__Compliance__r.Name',
        },
      });
    });
  });

  it('should render properly in Dark Mode', async () => {
    const promise = Promise.resolve();
    const { getByTestId } = await waitFor(() =>
      render(
        <Provider theme={DarkTheme}>
          <ToDoScreen />
        </Provider>
      )
    );
    await act(() => promise);

    const todoList = getByTestId('todoList');

    await act(async () => {
      todoList.props.onEndReached();
    });
  });

  it('should render properly on iPhone', async () => {
    helpers.isIphone = false;

    const promise = Promise.resolve();
    const { getByTestId } = await waitFor(() => render(<ToDoScreen />));
    await act(() => promise);

    const todoList = getByTestId('todoList');

    await act(async () => {
      todoList.props.onEndReached();
    });
  });

  it('should render properly on Web', async () => {
    Platform.OS = 'web';

    const promise = Promise.resolve();
    const { getByTestId } = await waitFor(() => render(<ToDoScreen />));
    await act(() => promise);

    const todoList = getByTestId('todoList');

    await act(async () => {
      todoList.props.onEndReached();
    });
  });

  it('should render properly and load more items', async () => {
    const promise = Promise.resolve();
    const { getByTestId } = await waitFor(() => render(<ToDoScreen />));
    await act(() => promise);

    const todoList = getByTestId('todoList');

    await act(async () => {
      todoList.props.onEndReached();
    });
  });

  it('should render properly and skip load more items', async () => {
    fetchToDo.mockReturnValue({
      done: true,
      queryLocator: '',
      records: [],
    });

    const promise = Promise.resolve();
    const { getByTestId } = await waitFor(() => render(<ToDoScreen />));
    await act(() => promise);

    const todoList = getByTestId('todoList');

    await act(async () => {
      todoList.props.onEndReached();
    });
  });

  it('should render properly, load more items and set no queryLocator', async () => {
    fetchByQueryLocator.mockReturnValue({
      done: false,
      queryLocator: null,
      records: [],
    });

    const promise = Promise.resolve();
    const { getByTestId } = await waitFor(() => render(<ToDoScreen />));
    await act(() => promise);

    const todoList = getByTestId('todoList');

    await act(async () => {
      todoList.props.onEndReached();
    });
  });

  it('should show error banner on picklist fetch', async () => {
    fetchComplianceMetadata.mockImplementation(() => {
      throw new Error({ message: 'Error' });
    });
    const promise = Promise.resolve();
    const { getByTestId } = await waitFor(() => render(<ToDoScreen />));
    await act(() => promise);

    await act(async () => {
      const toDoScreenBanner = getByTestId('toDoScreenBanner');
      expect(toDoScreenBanner).toBeTruthy();
    });
  });

  it('should show error banner on initial fetch data', async () => {
    fetchToDo.mockImplementation(() => {
      throw new Error({ message: 'Error' });
    });
    const promise = Promise.resolve();
    const { getByTestId } = await waitFor(() => render(<ToDoScreen />));
    await act(() => promise);

    await act(async () => {
      const toDoScreenBanner = getByTestId('toDoScreenBanner');
      expect(toDoScreenBanner).toBeTruthy();
    });
  });

  it('should render properly and show error banner on load more data', async () => {
    fetchByQueryLocator.mockImplementation(() => {
      throw new Error({ message: 'Error' });
    });
    const promise = Promise.resolve();
    const { getByTestId } = await waitFor(() => render(<ToDoScreen />));
    await act(() => promise);

    const todoList = getByTestId('todoList');

    await act(async () => {
      todoList.props.onEndReached();
    });
  });
});
