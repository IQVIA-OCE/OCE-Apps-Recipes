import React from 'react';
import { render, fireEvent, screen, act, cleanup } from '@testing-library/react-native';
import App, { dataReducer } from './App';
import { databaseManager } from '@oce-apps/oce-apps-bridges';
import { MenuButton, Provider, DarkTheme } from '@oce-apps/apollo-react-native';
import { TodoContext } from "./src/utils/context";

const mockedUseColorScheme = jest.fn();

jest.mock('react-native/Libraries/Utilities/useColorScheme', () => {
  return {
    default: mockedUseColorScheme,
  };
});

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

describe('App', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });
  it('renders the table with correct columns and no data', async () => {
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
  it('should render properly in dark mode', async () => {
    mockedUseColorScheme.mockImplementationOnce(() => 'dark')
    const tree = render(
      <TodoContext.Provider value={{state, dispatch}}>
        <Provider theme={DarkTheme}>
          <App>
          </App>
        </Provider>
    </TodoContext.Provider>
    )

    const promise = Promise.resolve();
    await act(() => promise);

    expect(tree).toBeTruthy();
  }); 
});

describe('App', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    databaseManager.fetch = jest
      .fn()
      .mockResolvedValue({ records: [
        {
          Id: "1",
          name: "Call To-Do"
        },
        {
          id: "2",
          name: "Call Business To-Do"
        }], done: true });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });
  it('renders the table with correct columns and record types', async () => {
    state =  
    {
      toDoData: [],
      businessToDoData: [],
      updateCallToDoData: [1,2],
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

    expect(screen.toJSON()).toMatchSnapshot();
  });
});

describe('App', () => {
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
  it('renders the table with correct columns and data', async () => {
    state =  
    {
      toDoData: [],
      businessToDoData: [],
      updateCallToDoData: [1,2],
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
    
    const promise = Promise.resolve();
    await act(() => promise);

    const bulkActions = screen.UNSAFE_getAllByType(MenuButton)[0];
    fireEvent.press(bulkActions);

    await act(() => promise);

    const cellname = screen.getByTestId('cellname_1');
    fireEvent(cellname, 'onPress', {nativeEvent: {}});

    const checkbox = screen.getByTestId('checkbox_1');
    fireEvent(checkbox, 'onChange', {nativeEvent: {}});

    const buttonFuncs = screen.getByTestId('buttonFuncs-test');
    fireEvent.press(buttonFuncs);

    expect(screen.toJSON()).toMatchSnapshot();
  });
});

describe('App', () => {
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
  it('renders the table: check dataReducer', async () => {
    state =  
    {
      toDoData: [1],
      businessToDoData: [1],
      updateCallToDoData: [1],
      updateCallBusinessToDoData: [1],
      deleteCallToDoData: [1],
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
        <App>
        </App>
      </TodoContext.Provider>
    );

    let action = {
      type: "ADD_TO_DO",
      payload: ["Record"]
    };
    dataReducer(state, action);

    action = {
      type: "ADD_BUSINESS_TO_DO",
      payload: ["Record"]
    };
    dataReducer(state, action);

    action = {
      type: "TO_DO",
      payload: ["Record"]
    };
    dataReducer(state, action);

    action = {
      type: "BUSINESS_TO_DO",
      payload: ["Record"]
    };
    dataReducer(state, action);

    action = {
      type: "UPDATE_CALL_TO_DO",
      payload: ["Record"]
    };
    dataReducer(state, action);

    action = {
      type: "UPDATE_CALL_BUSINESS_TO_DO",
      payload: ["Record"]
    };
    dataReducer(state, action);

    action = {
      type: "DELETE_CALL_TO_DO",
      payload: ["Record"]
    };
    dataReducer(state, action);

    action = {
      type: "DELETE_CALL_BUSINESS_TO_DO",
      payload: ["Record"]
    };
    dataReducer(state, action);

    action = {
      type: "FILTER_TO_DO",
      payload: ["Record"]
    };
    dataReducer(state, action);

    action = {
      type: "SEARCH_TO_DO",
      payload: ["Record"]
    };
    dataReducer(state, action);

    action = {
      type: "SET_DEFAULT_FILTER_TO_DO",
      payload: ["Record"]
    };
    dataReducer(state, action);

    action = {
      type: "FILTER_BUSINESS_TO_DO",
      payload: ["Record"]
    };
    dataReducer(state, action);

    action = {
      type: "SEARCH_BUSINESS_TO_DO",
      payload: ["Record"]
    };
    dataReducer(state, action);

    action = {
      type: "SET_DEFAULT_FILTER_BUSINESS_TO_DO",
      payload: ["Record"]
    };
    dataReducer(state, action);

    expect(screen.toJSON()).toMatchSnapshot();
  });
});

