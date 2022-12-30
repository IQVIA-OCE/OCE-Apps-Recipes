import { render } from '@testing-library/react-native';
import React from 'react';
import Filter from './Filter';
import { useSelector, useDispatch } from 'react-redux';
import { Select } from 'apollo-react-native';
import { setBrandFilterValue } from "../../stores/orders";
// import renderer from 'react-test-renderer';

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));

jest.mock('../../stores/orders', () => ({
    setBrandFilterValue: jest.fn()
}));

describe('Filter', () => {
    it('without data', () => {
        useSelector.mockImplementation((cb) => cb({
            ordersListReducers: {
                brandOptions: [],
                brandFilter: ''
            }
        }));
        const { container, toJSON } = render(<Filter />);
        expect(toJSON(container)).toMatchSnapshot();
    })
    it('with data', () => {
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            ordersListReducers: {
                brandOptions: [{ label: '123', id: '123'}],
                brandFilter: '12'
            }
        })); 
        const { container, toJSON } = render(<Filter />);
        expect(toJSON(container)).toMatchSnapshot();
        
        container.findAllByType(Select)[0].props.onChange({ value: 'none' });
        expect(setBrandFilterValue).toBeCalledTimes(1);
    })

})