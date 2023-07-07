
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Filters } from './Filters';
import { useSelector, useDispatch } from "react-redux";
import { fetchOrdersList } from '../../store/orders/ordersSlice';
import { arraysDiff } from '../../utils';
import { clearFilters, setFilter } from '../../store/filters/filtersSlice';
import { DELIVERY_END_DATE, DELIVERY_START_DATE, ORDER_END_DATE, ORDER_NAME, ORDER_START_DATE, PRODUCT_NAME } from '../../utils/constants';
import { mockState } from '../../mock';

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

jest.mock('oce-apps-bridges', () => ({
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
            let { container } = render(<Filters />);
            const orderStatus = container.findByProps({ testID: 'orderStatusSelect' });
            orderStatus._fiber.pendingProps.onChange({ label: 'test', value: 'test' });
            expect(arraysDiff).toHaveBeenCalledWith([{ label: 'Submitted', value: 'Submitted' }], [{ label: 'test', value: 'test' }]);
        });
    
        it('should set filter deliveryStatusSelect', () => {
            let { container } = render(<Filters />);
            const deliveryStatus = container.findByProps({ testID: 'deliveryStatusSelect' });
            deliveryStatus._fiber.pendingProps.onChange({ label: 'test', value: 'test' });
            expect(arraysDiff).toHaveBeenCalledWith([{ label: 'Submitted', value: 'Submitted' }], [{ label: 'test', value: 'test' }]);
        });
    
        it('should set filter Select brandsSelect', () => {
            let { container } = render(<Filters />);
            const brand = container.findByProps({ testID: 'brandsSelect' }); 
            brand._fiber.pendingProps.onChange({ label: 'test', value: 'test' });
            expect(arraysDiff).toHaveBeenCalledWith([{ label: 'Brand1', value: 'Brand1' }], [{ label: 'test', value: 'test' }]);
        });
    });

    describe('Should set filters Datepickers', () => {

        let dateExample = "2022-11-09T08:31:34.000Z";
        it('should set filter date orderStartPicker', async () => {
            let { container } = render(<Filters />);
            await waitFor(() => {
                const pickerWrapper = container.findByProps({ testID: 'orderStartPicker' });
                const picker = pickerWrapper.findByProps({ testID: 'datepicker' });
                picker._fiber.pendingProps.actions.done.onPress('', dateExample);
                expect(setFilter).toHaveBeenCalledWith({ key: ORDER_START_DATE, value: dateExample });
            });
        });
        it('should set filter date orderEndPicker', async () => {
            let { container } = render(<Filters />);
            await waitFor(() => {
                const pickerWrapper = container.findByProps({ testID: 'orderEndPicker' });
                const picker = pickerWrapper.findByProps({ testID: 'datepicker' });
                picker._fiber.pendingProps.actions.done.onPress('', dateExample);
                expect(setFilter).toHaveBeenCalledWith({ key: ORDER_END_DATE, value: dateExample });
            });
        });
        it('should set filter date deliveryStartPicker', async () => {
            let { container } = render(<Filters />);
            await waitFor(() => {
                const pickerWrapper = container.findByProps({ testID: 'deliveryStartPicker' });
                const picker = pickerWrapper.findByProps({ testID: 'datepicker' });
                picker._fiber.pendingProps.actions.done.onPress('', dateExample);
                expect(setFilter).toHaveBeenCalledWith({ key: DELIVERY_START_DATE, value: dateExample });
            });
        });
        it('should set filter date deliveryEndPicker', async () => {
            let { container } = render(<Filters />);
            await waitFor(() => {
                const pickerWrapper = container.findByProps({ testID: 'deliveryEndPicker' });
                const picker = pickerWrapper.findByProps({ testID: 'datepicker' });
                picker._fiber.pendingProps.actions.done.onPress('', dateExample);
                expect(setFilter).toHaveBeenCalledWith({ key: DELIVERY_END_DATE, value: dateExample });
            });
        });
    });

    describe('Should clear filters Search', () => {
        it('should clear filters Search 1', () => {
            let { container } = render(<Filters />);
            const search = container.findByProps({ testID: 'orderNameSearch' });
            search._fiber.pendingProps.onIconPress();
            expect(setFilter).toHaveBeenCalledWith({ key: ORDER_NAME, value: "" })
        });
        it('should clear filters Search 2', () => {
            let { container } = render(<Filters />);
            const search = container.findByProps({ testID: 'productNameSearch' });
            search._fiber.pendingProps.onIconPress();
            expect(setFilter).toHaveBeenCalledWith({ key: PRODUCT_NAME, value: "" })
        });
    });
})