import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import {SearchBusinessToDo} from './SearchBusinessToDo';
import { TodoContext } from "../utils/context";

describe('SearchBusinessToDo', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });
  
    afterEach(() => {
        jest.useRealTimers();
    });
  
    let state =  
        {
            toDoData: [],
            businessToDoData: [],
            updateCallToDoData: [],
            updateCallBusinessToDoData: [],
            deleteCallToDoData: [],
            recordId: "12345",
            accountName: "",
            userFullName: "User Name",
            filterTodo: "",
            filterBusinessTodo: "",
            searchTodo: false,
            searchBusinessTodo: true,
            setDefaultFiltersToDo: false,
            setDefaultFiltersBusinessToDo: true,
            productsDetailed: [],
            attendees: [],
            permissions: []
        };
    const dispatch = jest.fn();

    it('should render with no filters set', async () => {
        
        render(
        <TodoContext.Provider value={{state, dispatch}}>
            <SearchBusinessToDo />
        </TodoContext.Provider>);
        const showFilterButton = screen.getByTestId('hidden-filters');
        fireEvent.press(showFilterButton);

        const hideFilterButtonDisplayed = await screen.findByTestId('displayed-filters');

        const addingFilterButton = screen.getByTestId('adding-filters');
        fireEvent.press(addingFilterButton);
        expect(screen.toJSON()).toMatchSnapshot();
    });
});

describe('SearchBusinessToDo', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });
  
    afterEach(() => {
        jest.useRealTimers();
    });
  
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
            searchBusinessTodo: true,
            setDefaultFiltersToDo: false,
            setDefaultFiltersBusinessToDo: true,
            productsDetailed: ['Test 1', 'Test 2'],
            attendees: [],
            permissions: []
        };
    const dispatch = jest.fn();
    const setKey = jest.fn();
    const AddFilter = jest.fn();
    const HandleRemoveChip = jest.fn();

    it('should render with no filters set', async () => {
        
        render(
        <TodoContext.Provider value={{state, dispatch}}>
            <SearchBusinessToDo />
        </TodoContext.Provider>);
        const showFilterButton = screen.getByTestId('hidden-filters');
        fireEvent.press(showFilterButton);

        const hideFilterButtonDisplayed = await screen.findByTestId('displayed-filters');

        const addingFilterButton = screen.getByTestId('adding-filters');
        fireEvent.press(addingFilterButton);
        expect(screen.toJSON()).toMatchSnapshot();
    });

    it('should render with name', async () => {
        
        render(
        <TodoContext.Provider value={{state, dispatch}}>
            <SearchBusinessToDo />
        </TodoContext.Provider>);
        const showFilterButton = screen.getByTestId('hidden-filters');
        fireEvent.press(showFilterButton);

        const hideFilterButtonDisplayed = await screen.findByTestId('displayed-filters');

        const viewFieldSelect = await screen.findByTestId('select-field');
        const fieldSelect = viewFieldSelect.children[0];
        await waitFor(() => {
            fieldSelect.props.onChange([{ label: 'test', value: 'test' }]);
        });
        const addingFilterButton = screen.getByTestId('adding-filters');
        fireEvent.press(addingFilterButton);
        expect(screen.toJSON()).toMatchSnapshot();
    });

    it('should render with name and operator', async () => {
        
        render(
        <TodoContext.Provider value={{state, dispatch}}>
            <SearchBusinessToDo />
        </TodoContext.Provider>);
        const showFilterButton = screen.getByTestId('hidden-filters');
        fireEvent.press(showFilterButton);

        const hideFilterButtonDisplayed = await screen.findByTestId('displayed-filters');

        const viewFieldSelect = await screen.findByTestId('select-field');
        const fieldSelect = viewFieldSelect.children[0];

        const viewOperatorSelect = await screen.findByTestId('select-operator');
        const operatorSelect = viewOperatorSelect.children[0];

        await waitFor(() => {
            fieldSelect.props.onChange([{ label: 'test', value: 'test' }]);
            operatorSelect.props.onChange([{ label: 'Equals', value: 'equal' }]);
        });
        const addingFilterButton = screen.getByTestId('adding-filters');
        fireEvent.press(addingFilterButton);

        fireEvent.press(addingFilterButton);
        expect(screen.toJSON()).toMatchSnapshot();
    });

    it('should render with name and operator nad input', async () => {
        
        render(
        <TodoContext.Provider value={{state, dispatch}}>
            <SearchBusinessToDo />
        </TodoContext.Provider>);
        const showFilterButton = screen.getByTestId('hidden-filters');
        fireEvent.press(showFilterButton);

        const hideFilterButtonDisplayed = await screen.findByTestId('displayed-filters');

        const viewFieldSelect = await screen.findByTestId('select-field');
        const fieldSelect = viewFieldSelect.children[0];

        const viewOperatorSelect = await screen.findByTestId('select-operator');
        const operatorSelect = viewOperatorSelect.children[0];

        const inputText = screen.queryByTestId('input-text');
        fireEvent.changeText(inputText, "Filter 1");

        await waitFor(() => {
            fieldSelect.props.onChange([{ label: 'test', value: 'test' }]);
            operatorSelect.props.onChange([{ label: 'Equals', value: 'equal' }]);
        });
        const addingFilterButton = screen.getByTestId('adding-filters');
        fireEvent.press(addingFilterButton);

        fireEvent.press(addingFilterButton);
        expect(screen.toJSON()).toMatchSnapshot();
    });
    

    it('should render with name, operator, input and clause', async () => {
        
        render(
        <TodoContext.Provider value={{state, dispatch}}>
            <SearchBusinessToDo />
        </TodoContext.Provider>);

        const showFilterButton = screen.getByTestId('hidden-filters');
        fireEvent.press(showFilterButton);

        // Using `findBy` query to wait for asynchronous operation to finish
        const hideFilterButtonDisplayed = await screen.findByTestId('displayed-filters');

        const addingFilterButton = screen.getByTestId('adding-filters');

        const searchButton = screen.getByTestId('search-button');
        fireEvent.press(searchButton);

        const accordionView = screen.getByTestId('accordion-view');
        
        const viewFieldSelect = await screen.findByTestId('select-field');
        const fieldSelect = viewFieldSelect.children[0];

        const viewOperatorSelect = await screen.findByTestId('select-operator');
        const operatorSelect = viewOperatorSelect.children[0];

        const inputText = screen.queryByTestId('input-text');
        fireEvent.changeText(inputText, "Filter 1");

        const viewClauseSelect = await screen.findByTestId('select-clause');
        const clauseSelect = viewClauseSelect.children[0];

        await waitFor(() => {
            fieldSelect.props.onChange([{ label: 'test', value: 'test' }]);
            operatorSelect.props.onChange([{ label: 'Equals', value: 'equal' }]);
            clauseSelect.props.onChange([{ label: 'test', value: 'test' }]);
        });
        fireEvent.press(addingFilterButton);
        fireEvent.press(addingFilterButton);
        
        const chipContainer = screen.getByTestId('chipContainer_1');
        const chipClose = chipContainer.children[0];
        chipClose.props.onClose();

        fireEvent.press(hideFilterButtonDisplayed);
       
        expect(screen.toJSON()).toMatchSnapshot();
          
    })

    
});
