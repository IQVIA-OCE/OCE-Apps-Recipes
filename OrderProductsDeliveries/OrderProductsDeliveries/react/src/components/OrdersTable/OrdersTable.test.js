import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import OrdersTable from "./OrdersTable";
import { useSelector } from 'react-redux';
import mockData from '../../utils/mock.json';

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));

describe('Orders Table', () => {
    beforeEach(() => {
        useSelector.mockImplementation((cb) => cb({
            ordersListReducers: {
                loading: false,
                orders: mockData
            }
        }));
    })
    it('render with data', () => {
        
        const { getByTestId } = render(<OrdersTable />)
        const tableContainer = getByTestId("table-container");
        const productNameTh = getByTestId("product-name-th");
        const datesThScrollview = getByTestId("dates-th-scrollview");
        const totalQtyTh = getByTestId("total-qty-th");
        const mainScrollview = getByTestId("main-scrollview");
        const horizontalScrollviewQty = getByTestId("horizontal-scrollview-qty");
        const totalQtyContainer = getByTestId("total-qty-container");
        const totalQtyScrollview = getByTestId("total-qty-scrollview");

        expect(tableContainer).toBeTruthy();
        expect(productNameTh).toBeTruthy();
        expect(datesThScrollview).toBeTruthy();
        expect(totalQtyTh).toBeTruthy();
        expect(mainScrollview).toBeTruthy();
        expect(horizontalScrollviewQty).toBeTruthy();
        expect(totalQtyContainer).toBeTruthy();
        expect(totalQtyScrollview).toBeTruthy();

    })

    it('scroll dates-th-scrollview', () => {
        const { getByTestId } = render(<OrdersTable />)
        const datesThScrollview = getByTestId("dates-th-scrollview");
        fireEvent.scroll(datesThScrollview, {
            nativeEvent: {
                contentOffset: { y: 0, x: 0 },
            },
            target: { scrollX: 100 }
        });
    });

    it('scroll horizontal-scrollview-qty', () => {
        const { getByTestId } = render(<OrdersTable />)
        const horizontalScrollviewQty = getByTestId("horizontal-scrollview-qty");
        fireEvent.scroll(horizontalScrollviewQty, {
            nativeEvent: {
                contentOffset: { y: 0, x: 0 },
            },
            target: { scrollX: 100 }
        });
    });

    it('scroll total-qty-scrollview', () => {
        const { getByTestId } = render(<OrdersTable />)
        const totalQtyScrollview = getByTestId("total-qty-scrollview");
        fireEvent.scroll(totalQtyScrollview, {
            nativeEvent: {
                contentOffset: { y: 0, x: 0 },
            },
            target: { scrollX: 100 }
        });
    });

})


