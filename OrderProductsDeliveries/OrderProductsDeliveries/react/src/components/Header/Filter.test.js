import { render } from '@testing-library/react-native';
import React from 'react';
import Filter from './Filter';
import { useSelector } from 'react-redux';
// import { setBrandFilterValue } from "../../stores/orders";
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
        render(
            <Filter />
        );
    })
    it('with data', () => {
        useSelector.mockImplementation((cb) => cb({
            ordersListReducers: {
                brandOptions: [{ label: '123', id: '123'}],
                brandFilter: '12'
            }
        })); 
        render(
            <Filter />
        );
        // const select = UNSAFE_getAllByType('View');
        //  console.log(select);

        // const tree = renderer.create(
        //     <Filter item={item}/>
        // ).toJSON();

        // expect(tree).toMatchSnapshot();

        // expect(setBrandFilterValue).toBeCalledTimes(1);
    })

})