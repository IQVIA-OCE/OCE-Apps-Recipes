
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import React from 'react';
import { Filters } from './Filters';
import { useSelector, useDispatch } from "react-redux";
import { fetchOrdersList } from '../../store/orders/ordersSlice';
import { arraysDiff } from '../../utils';
import { clearFilters, setFilter } from '../../store/filters/filtersSlice';
import { DELIVERY_END_DATE, DELIVERY_START_DATE, ORDER_END_DATE, ORDER_NAME, ORDER_START_DATE, PRODUCT_NAME } from '../../utils/constants';
import { mockState } from '../../mock';
import { Pressable } from 'react-native';

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));

jest.mock('../../store/orders/ordersSlice', () => ({
    fetchOrdersList: jest.fn(),
}));

jest.mock('../../store/filters/filtersSlice', () => ({
    clearFilters: jest.fn(),
    setFilter: jest.fn()
}));

jest.mock('../../utils', () => ({
    arraysDiff: jest.fn()
}));

jest.mock('@oce-apps/oce-apps-bridges', () => ({
    sfNetAPI: {
      describe: jest.fn(),
      metadata: jest.fn(),
      enablePromises: jest.fn()
    },
    environment: {
        namespace: () => 'OCE__',
    },
    databaseManager: {
        fetch: jest.fn()
    }
}));

const dispatch = jest.fn();
describe('Filters', () => {
    beforeEach(() => {
        useDispatch.mockImplementation(() => dispatch);
        useSelector.mockImplementation((cb) => cb(mockState)
        );
    });

    it('should call fetchOrdersList when apply press', () => {
        let { getByTestId } = render(<Filters />);
        const apply = getByTestId('applyButton');
        fireEvent.press(apply);
        expect(fetchOrdersList).toHaveBeenCalled();
    });

    it('should reset filters', () => {
        let { getByTestId } = render(<Filters />);
        const clear = getByTestId('clearButton');
        fireEvent.press(clear);
        expect(clearFilters).toHaveBeenCalled();
    });

    describe('Should set filters Select', () => {
        it('should set filter orderStatusSelect', () => {
            let { getByTestId } = render(<Filters />);
            const orderStatus = getByTestId('orderStatusSelect');
            fireEvent(orderStatus, 'onChange', { label: 'test', value: 'test' })
            expect(arraysDiff).toHaveBeenCalledWith([{ label: 'Submitted', value: 'Submitted' }], [{ label: 'test', value: 'test' }]);
        });

        it('should set filter deliveryStatusSelect', () => {
            let { getByTestId } = render(<Filters />);
            const deliveryStatusSelect = getByTestId('deliveryStatusSelect');
            fireEvent(deliveryStatusSelect, 'onChange', { label: 'test', value: 'test' })
            expect(arraysDiff).toHaveBeenCalledWith([{ label: 'Submitted', value: 'Submitted' }], [{ label: 'test', value: 'test' }]);
        });

        it('should set filter Select brandsSelect', () => {
            let { getByTestId } = render(<Filters />);
            const brand = getByTestId('brandsSelect');
            fireEvent(brand, 'onChange', { label: 'test', value: 'test' })
            expect(arraysDiff).toHaveBeenCalledWith([{ label: 'Brand1', value: 'Brand1' }], [{ label: 'test', value: 'test' }]);
        });
    });

    describe('Should set filters Datepickers', () => {

        let dateExample = "2022-11-09T08:31:34.000Z";
        it('should set filter date orderStartPicker', async () => {
            let { getByTestId } = render(<Filters />);
            await waitFor(() => {
                const pickerWrapper = getByTestId('orderStartPicker');
                const picker = pickerWrapper.findByProps({ testID: 'datepicker' });
                picker.props.actions.done.onPress(null, dateExample)
                expect(setFilter).toHaveBeenCalledWith({ key: ORDER_START_DATE, value: dateExample });
            });
        });
        it('should set filter date orderEndPicker', async () => {
            let { getByTestId } = render(<Filters />);
            await waitFor(() => {
                const pickerWrapper = getByTestId('orderEndPicker');
                const picker = pickerWrapper.findByProps({ testID: 'datepicker' });
                picker.props.actions.done.onPress(null, dateExample)
                expect(setFilter).toHaveBeenCalledWith({ key: ORDER_END_DATE, value: dateExample });
            });
        });
        it('should set filter date deliveryStartPicker', async () => {
            let { getByTestId } = render(<Filters />);
            await waitFor(() => {
                const pickerWrapper = getByTestId('deliveryStartPicker');
                const picker = pickerWrapper.findByProps({ testID: 'datepicker' });
                picker.props.actions.done.onPress(null, dateExample)
                expect(setFilter).toHaveBeenCalledWith({ key: DELIVERY_START_DATE, value: dateExample });
            });
        });
        it('should set filter date deliveryEndPicker', async () => {
            let { getByTestId } = render(<Filters />);
            await waitFor(() => {
                const pickerWrapper = getByTestId('deliveryEndPicker');
                const picker = pickerWrapper.findByProps({ testID: 'datepicker' });
                picker.props.actions.done.onPress(null, dateExample)
                expect(setFilter).toHaveBeenCalledWith({ key: DELIVERY_END_DATE, value: dateExample });
            });
        });
    });

    describe('Should clear filters Search', () => {
        it('should clear filters Search 1',  () => {
            let { UNSAFE_getByProps, getByTestId } = render(<Filters />);
            const input = getByTestId('orderNameSearch');
            act(() => {
                fireEvent.changeText(input, 'test');
                const icon = UNSAFE_getByProps({ source: 'close' });
                fireEvent.press(icon);
            });
            expect(setFilter).toHaveBeenCalledWith({ key: ORDER_NAME, value: "" });
        });
        it('should clear filters Search 2', () => {
            let { UNSAFE_getByProps, getByTestId } = render(<Filters />);
            const input = getByTestId('productNameSearch');
            act(() => {
                fireEvent.changeText(input, 'test');
                const icon = UNSAFE_getByProps({ source: 'close' });
                fireEvent.press(icon);
            });
            expect(setFilter).toHaveBeenCalledWith({ key: PRODUCT_NAME, value: "" });
        });
    });
})
