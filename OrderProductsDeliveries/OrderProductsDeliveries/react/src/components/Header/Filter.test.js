import { render } from '@testing-library/react-native';
import React from 'react';
import Filter from './Filter';
import { useSelector, useDispatch } from 'react-redux';
import { setBrandFilterValue } from "../../stores/orders";

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));

jest.mock('../../stores/orders', () => ({
    setBrandFilterValue: jest.fn()
}));

describe('Filter', () => {
    it('should render select without options', () => {
        useSelector.mockImplementation((cb) => cb({
            orders: {
                brandOptions: [],
                brandFilter: ''
            } 
        }));
        const { getByTestId } = render(<Filter />);
        const select = getByTestId('filterWrapper').children[0];
        expect(select).toBeTruthy();
        expect(select.props.options).toEqual([]);
    })
    it('should render select with options', () => {
        const options = [{ label: '123', id: '123'}];
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            orders: {
                brandOptions: options,
                brandFilter: '12'
            }
        })); 
        const { getByTestId } = render(<Filter />);
        const select = getByTestId('filterWrapper').children[0];
        expect(select).toBeTruthy();
        expect(select.props.options).toEqual(options);
        select.props.onChange({ value: 'none' });
        expect(setBrandFilterValue).toBeCalledTimes(1);
    });

    it('should call setBrandFilterValue on change select', () => {
        const options = [{ label: '123', id: '123'}];
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            orders: {
                brandOptions: options,
                brandFilter: '12'
            }
        })); 
        const { getByTestId } = render(<Filter />);
        const select = getByTestId('filterWrapper').children[0];
        expect(select).toBeTruthy();
        select.props.onChange({ value: 'none' });
        expect(setBrandFilterValue).toBeCalled();
    });

})