import React from 'react';
import { render, waitFor, fireEvent, screen } from '@testing-library/react-native';
import { TodoContext } from "../utils/context";
import { sortStrings, sortPicklists, TableBusinessToDos } from './TableBusinessToDos';
import { SearchBusinessToDo } from './SearchBusinessToDo';
import { databaseManager } from '@oce-apps/oce-apps-bridges';

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
  filterTodo: " and account = '-1'",
  filterBusinessTodo: " and product = 'Product 1'",
  searchTodo: true,
  searchBusinessTodo: true,
  setDefaultFiltersToDo: true,
  setDefaultFiltersBusinessToDo: true,
  productsDetailed: ['Test 1', 'Test 2'],
  attendees: [],
  permissions: []
};
const dispatch = jest.fn();


describe('TableBusinessToDos', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });
  it('renders the table with correct columns and data', async () => {
    databaseManager.fetch = jest
      .fn()
      .mockResolvedValue({ records: [
        {
          Id: 1,
          name: 'Business To Do 01',
          "OCE__BusinessTactic__r.OCE__BusinessObjective__r.OCE__Product__c": 'Product 1',
          OCE__DueDate__c: '01/06/2022',
          OCE__Status__c: 'In Progress',
        },
        {
          Id: 2,
          name: 'Business To Do 02',
          "OCE__BusinessTactic__r.OCE__BusinessObjective__r.OCE__Product__c": 'Product 2',
          OCE__DueDate__c: '04/06/2022',
          OCE__Status__c: 'In Progress',
        }], done: true });

    render(
      <TodoContext.Provider value={{state, dispatch}}>
        <SearchBusinessToDo>
          <TableBusinessToDos />
        </SearchBusinessToDo>
      </TodoContext.Provider>
    );

    const table = screen.getByTestId('table');
    expect(table).toBeTruthy();
    expect(screen.toJSON()).toMatchSnapshot();

    await waitFor(() => {
      
    });
  });
});


describe('TableBusinessToDos', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });
  it('renders the table with correct columns and no data with filter ToDo', async () => {
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
      filterTodo: " or account = '-1'",
      filterBusinessTodo: " or product = 'Product 1'",
      searchTodo: true,
      searchBusinessTodo: true,
      setDefaultFiltersToDo: true,
      setDefaultFiltersBusinessToDo: true,
      productsDetailed: ['Test 1', 'Test 2'],
      attendees: [],
      permissions: []
    };
    databaseManager.fetch = jest
      .fn()
      .mockResolvedValue({ records: [], done: true });

    render(
      <TodoContext.Provider value={{state, dispatch}}>
        <SearchBusinessToDo>
          <TableBusinessToDos />
        </SearchBusinessToDo>
      </TodoContext.Provider>
    );

    expect(screen.toJSON()).toMatchSnapshot();
  });
});

describe('TableBusinessToDos', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });
  it('renders the table with correct columns and no data without filter ToDo', async () => {
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
      filterTodo: " or account = '-1'",
      filterBusinessTodo: " or product = 'Product 1'",
      searchTodo: false,
      searchBusinessTodo: false,
      setDefaultFiltersToDo: false,
      setDefaultFiltersBusinessToDo: false,
      productsDetailed: ['Test 1', 'Test 2'],
      attendees: [],
      permissions: []
    };
    databaseManager.fetch = jest
      .fn()
      .mockResolvedValue({ records: [], done: true });

    render(
      <TodoContext.Provider value={{state, dispatch}}>
        <SearchBusinessToDo>
          <TableBusinessToDos />
        </SearchBusinessToDo>
      </TodoContext.Provider>
    );

    expect(screen.toJSON()).toMatchSnapshot();
  });
});


describe('TableBusinessToDos', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    databaseManager.fetch = jest
      .fn()
      .mockResolvedValue({ records: [
        {
          Id: 1,
          name: 'Business To Do 01',
          "OCE__BusinessTactic__r.OCE__BusinessObjective__r.OCE__Product__c": 'Product 1',
          OCE__DueDate__c: '01/06/2022',
          OCE__Status__c: 'In Progress',
        },
        {
          Id: 2,
          name: 'Business To Do 02',
          "OCE__BusinessTactic__r.OCE__BusinessObjective__r.OCE__Product__c": 'Product 2',
          OCE__DueDate__c: '04/06/2022',
          OCE__Status__c: 'In Progress',
        }], done: true });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });
  it('renders the table with correct columns and data, filter BusinessToDo', async () => {
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
      filterBusinessTodo: " and product = 'Product 1'",
      searchTodo: false,
      searchBusinessTodo: true,
      setDefaultFiltersToDo: false,
      setDefaultFiltersBusinessToDo: true,
      productsDetailed: [],
      attendees: [],
      permissions: []
    };
    
    render(
      <TodoContext.Provider value={{state, dispatch}}>
        <SearchBusinessToDo>
          <TableBusinessToDos />
        </SearchBusinessToDo>
      </TodoContext.Provider>
    );

    expect(screen.toJSON()).toMatchSnapshot();
  });
});

describe('TableBusinessToDos', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    databaseManager.fetch = jest
      .fn()
      .mockResolvedValue({ records: [
        {
          Id: 1,
          name: 'Business To Do 01',
          "OCE__BusinessTactic__r.OCE__BusinessObjective__r.OCE__Product__c": 'Product 1',
          OCE__DueDate__c: '01/06/2022',
          OCE__Status__c: 'In Progress',
        },
        {
          Id: 2,
          name: 'Business To Do 02',
          "OCE__BusinessTactic__r.OCE__BusinessObjective__r.OCE__Product__c": 'Product 2',
          OCE__DueDate__c: '04/06/2022',
          OCE__Status__c: 'In Progress',
        }], done: true });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });
  it('renders the table with correct columns and data, search and checkbox', async () => {
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
      filterBusinessTodo: " and product = 'Product 1'",
      searchTodo: false,
      searchBusinessTodo: true,
      setDefaultFiltersToDo: false,
      setDefaultFiltersBusinessToDo: false,
      productsDetailed: [],
      attendees: [],
      permissions: []
    };
    
    render(
      <TodoContext.Provider value={{state, dispatch}}>
        <SearchBusinessToDo>
          <TableBusinessToDos />
        </SearchBusinessToDo>
      </TodoContext.Provider>
    );

    const showFilterButton = screen.getByTestId('hidden-filters');
    fireEvent.press(showFilterButton);

    const hideFilterButtonDisplayed = await screen.findByTestId('displayed-filters');
    const searchButton = screen.getByTestId('search-button');
    fireEvent.press(searchButton);

    //const cellname = screen.getByTestId('cellname_1');
    //fireEvent(cellname, 'onPress', {nativeEvent: {}});

    //const checkbox = screen.getByTestId('checkbox_1');
    //fireEvent(checkbox, 'onChange', {nativeEvent: {}});

    expect(screen.toJSON()).toMatchSnapshot();
  });
  it('renders the table with correct columns and data, search and checkbox 2', async () => {
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
      filterBusinessTodo: " or product = 'Product 1'",
      searchTodo: false,
      searchBusinessTodo: true,
      setDefaultFiltersToDo: false,
      setDefaultFiltersBusinessToDo: false,
      productsDetailed: [],
      attendees: [],
      permissions: []
    };
    
    render(
      <TodoContext.Provider value={{state, dispatch}}>
        <SearchBusinessToDo>
          <TableBusinessToDos />
        </SearchBusinessToDo>
      </TodoContext.Provider>
    );

    const showFilterButton = screen.getByTestId('hidden-filters');
    fireEvent.press(showFilterButton);

    const hideFilterButtonDisplayed = await screen.findByTestId('displayed-filters');
    //const searchButton = screen.getByTestId('search-button');
    //fireEvent.press(searchButton);

    await waitFor(() => {
      let searchButton = screen.getByTestId('search-button');
      fireEvent.press(searchButton);
    });

    const cellname = await screen.findByTestId('cellname_1'); 
    //screen.getByTestId('cellname_1');
    fireEvent(cellname, 'onPress', {nativeEvent: {}});

    const checkbox = await screen.findByTestId('checkbox_1'); 
    //const checkbox = screen.getByTestId('checkbox_1');
    fireEvent(checkbox, 'onChange', {nativeEvent: {}});

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
