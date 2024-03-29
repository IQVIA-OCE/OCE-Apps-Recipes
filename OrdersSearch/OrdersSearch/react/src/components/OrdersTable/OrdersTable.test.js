import { render } from '@testing-library/react-native';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { mockState } from '../../mock';
import { LOADING_STATUS, PAGE_TYPE } from '../../utils/constants';
import CustomCellOrder from './CustomCellOrder';
import { OrdersTable } from './OrdersTable';

jest.mock('@oce-apps/oce-apps-bridges', () => ({
    sfNetAPI: {
      describe: jest.fn(),
      metadata: jest.fn(),
      enablePromises: jest.fn()
    },
    environment: {
        namespace: () => 'OCE__',
        locale: () => 'en_US',
    },
    databaseManager: {
        fetch: jest.fn()
    },
    localized: jest.fn()
}));

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));

const dispatch = jest.fn();
describe('OrdersTable', () => {

    it('should render OrdersTable with data', () => {
        useDispatch.mockImplementation(() => dispatch);
        useSelector.mockImplementation((cb) => cb({
                ...mockState
            })
        );
        let { UNSAFE_getAllByType } = render(<OrdersTable />);
        const orders = UNSAFE_getAllByType(CustomCellOrder);
        expect(orders.length).toEqual(mockState.orders.ordersList.list.length);
    });
    it('should render OrdersTable with data on HomePage', () => {
        useDispatch.mockImplementation(() => dispatch);
        useSelector.mockImplementation((cb) => cb({
                ...mockState,
                orders: {
                    ...mockState.orders,
                    pageType: PAGE_TYPE.HOME
                }
            })
        );
        let { UNSAFE_getAllByType } = render(<OrdersTable />);
        const orders = UNSAFE_getAllByType(CustomCellOrder);
        expect(orders.length).toEqual(mockState.orders.ordersList.list.length);
    });
});
