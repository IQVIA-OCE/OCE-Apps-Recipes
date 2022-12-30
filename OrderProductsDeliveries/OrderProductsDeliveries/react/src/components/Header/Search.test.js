import { render, fireEvent } from '@testing-library/react-native';
import React from 'react';
import Search from './Search';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchProductValue } from '../../stores/orders';
import renderer from 'react-test-renderer';

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));

jest.mock('../../stores/orders', () => ({
    setSearchProductValue: jest.fn()
}));

it('Search', () => {
    useSelector.mockImplementation((cb) => cb({
        ordersListReducers: {
            searchProductValue: ""
        }
    }));
    useDispatch.mockReturnValue(jest.fn());
    const { getByTestId } = render(
        <Search />
    );
    const searchView = getByTestId('search-view');
    fireEvent.changeText(searchView, 'test');
    expect(setSearchProductValue).toBeCalledWith('test');
});