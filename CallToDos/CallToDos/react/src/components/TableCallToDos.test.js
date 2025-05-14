import React from 'react';
import { render, fireEvent, screen, act, cleanup } from '@testing-library/react-native';
import App from '../../App';
import { TodoContext } from "../utils/context";
import { sortStrings, sortPicklists, TableCallToDos } from './TableCallToDos';
import { databaseManager } from '@oce-apps/oce-apps-bridges';
import { MenuButton } from '@oce-apps/apollo-react-native';

jest.mock('@oce-apps/oce-apps-bridges', () => ({
  databaseManager: {
      upsert: jest.fn(),
      fetch: jest.fn(),
      delete: jest.fn(),
  },
  layoutBridge: {
    setHeight: jest.fn(),
  },
  environment: {
    locale: () => 'en_US',
    userId: () => 'User_Z1'
  },
}));

let state =  
{
  toDoData: [],
  businessToDoData: [],
  updateCallToDoData: [],
  updateCallBusinessToDoData: [],
  deleteCallToDoData: [],
  recordId: "12345",
  accountName: "Account Name",
  userFullName: "User Name",
  filterTodo: "",
  filterBusinessTodo: "",
  searchTodo: false,
  searchBusinessTodo: false,
  setDefaultFiltersToDo: false,
  setDefaultFiltersBusinessToDo: false,
  productsDetailed: ['Test 1', 'Test 2'],
  attendees: [],
  permissions: {
    canAddMain: true,
    canEditMain: true,
    canDeleteMain: true,
    mainObjectContextFound: true,
    canAddChild: true,
    canEditChild: true,
    canDeleteChild: true,
    childObjectContextFound: false,
  }
};
const dispatch = jest.fn();

describe('TableCallToDos', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });
  it('renders the table with correct columns and data', async () => {
    databaseManager.fetch = jest
      .fn()
      .mockResolvedValue({ records: [], done: true });

    render(
      <TodoContext.Provider value={{state, dispatch}}>
        <App>
        </App>
      </TodoContext.Provider>
    );

    const table = screen.getByTestId('tableCT');
    expect(table).toBeTruthy();
    expect(screen.toJSON()).toMatchSnapshot();
  });
});

describe('TableCallToDos', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    databaseManager.fetch = jest
      .fn()
      .mockResolvedValue({ records: [
        {
          Id: 1,
          "OCE__ToDo__r.Name": 'To Do 01',
          OCE__ToDo__c: 'ToDo1',
          "OCE__ToDo__r.OCE__AssignedTo__r.Name": 'Me',
          "OCE__ToDo__r.OCE__DueDate__c": '01/06/2022',
          OCE__Status__c: 'In Progress'
        },
        {
          id: 2,
          "OCE__ToDo__r.Name": 'To Do 02',
          OCE__ToDo__c: 'ToDo2',
          "OCE__ToDo__r.OCE__AssignedTo__r.Name": 'Owner',
          "OCE__ToDo__r.OCE__DueDate__c": '04/06/2022',
          OCE__Status__c: 'In Progress'
        }], done: true });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });
  it('renders the table with correct columns and data 2', async () => {
    state =  
    {
      toDoData: [],
      businessToDoData: [],
      updateCallToDoData: [],
      updateCallBusinessToDoData: [],
      deleteCallToDoData: [],
      recordId: "12345",
      accountName: "Account Name",
      userFullName: "User Name",
      filterTodo: "",
      filterBusinessTodo: "",
      searchTodo: false,
      searchBusinessTodo: false,
      setDefaultFiltersToDo: false,
      setDefaultFiltersBusinessToDo: false,
      productsDetailed: [],
      attendees: [],
      permissions: {
        canAddMain: true,
        canEditMain: true,
        canDeleteMain: true,
        mainObjectContextFound: true,
        canAddChild: true,
        canEditChild: true,
        canDeleteChild: true,
        childObjectContextFound: false,
      }
    };
    
    render(
      <TodoContext.Provider value={{state, dispatch}}>
        <App isTest={true}>
        </App>
      </TodoContext.Provider>
    );
    
    /*
    const firstRowCheckbox = screen.UNSAFE_getAllByType(Checkbox)[1];

    act(() => {
      firstRowCheckbox.props.onChange();
    });
    */
    const promise = Promise.resolve();
    await act(() => promise);

    const bulkActions = screen.UNSAFE_getAllByType(MenuButton)[0];
    fireEvent.press(bulkActions);
    

    await act(() => promise);

    const cellname = screen.getByTestId('cellname_1');
    fireEvent(cellname, 'onPress', {nativeEvent: {}});

    const checkbox = screen.getByTestId('checkbox_1');
    fireEvent(checkbox, 'onChange', {nativeEvent: {}});

    const buttonFuncs = screen.getByTestId('buttonFuncs-testCT');
    fireEvent.press(buttonFuncs);

    expect(screen.toJSON()).toMatchSnapshot();
  });

});

describe('sortStrings function', () => {
  it('should sort strings in ascending order', () => {
    const a = { name: 'apple' };
    const b = { name: 'banana' };

    expect(sortStrings('name', 'ascending', a, b)).toBe(-1);
    expect(sortStrings('name', 'ascending', b, a)).toBe(1);
    expect(sortStrings('name', 'ascending', a, a)).toBe(0);
  });

  it('should sort strings in descending order', () => {
    const a = { name: 'apple' };
    const b = { name: 'banana' };

    expect(sortStrings('name', 'descending', a, b)).toBe(1);
    expect(sortStrings('name', 'descending', b, a)).toBe(-1);
    expect(sortStrings('name', 'descending', a, a)).toBe(0);
  });
});

describe('sortPicklists function', () => {
  it('should sort picklists in ascending order', () => {
    const a = { status: { label: 'In progress', id: 5 } };
    const b = { status: { label: 'New', id: 1 } };

    expect(sortPicklists('status', 'ascending', a, b)).toBe(-1);
    expect(sortPicklists('status', 'ascending', b, a)).toBe(1);
    expect(sortPicklists('status', 'ascending', a, a)).toBe(0);
  });

  it('should sort picklists in descending order', () => {
    const a = { status: { label: 'In progress', id: 5 } };
    const b = { status: { label: 'New', id: 1 } };

    expect(sortPicklists('status', 'descending', a, b)).toBe(1);
    expect(sortPicklists('status', 'descending', b, a)).toBe(-1);
    expect(sortPicklists('status', 'descending', a, a)).toBe(0);
  });
});
