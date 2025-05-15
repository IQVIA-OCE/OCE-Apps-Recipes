import React from 'react';
import StackedBarChartCallDetails from './index';
import { navigator } from '@oce-apps/oce-apps-bridges';
import moment from 'moment';
import { fireEvent, render, screen, act } from '@testing-library/react-native';
import { Button, IconButton } from '@oce-apps/apollo-react-native';
import { NativeModules } from "react-native";
import api from '../api/api';

const CALL_MOCK = {
    records: [{
        OCE__CallDateTime__c: 'Tue May 1 2020 16:31:00 GMT+0300 (Eastern European Summer Time)'
    }]
};
jest.mock('../api/api', () => ({
    fetchCall: jest.fn().mockResolvedValue(CALL_MOCK),
}));

jest.mock('moment', () => () => ({
    format: () => "2001-05-01T00:00:00.000",
    subtract: () => "2001-05-01T00:00:00.000",
    add: jest.fn().mockReturnThis(),
    isValid: jest.fn().mockReturnValue(true)
}));

describe('StackedBarChartCallDetails', () => {
    it('should render properly', async () => {
        console.warn = jest.fn();

        const { findByTestId } = render(<StackedBarChartCallDetails />);
        act(() => jest.runAllTimers());
        const chartContainer = await findByTestId('chart-container');
        expect(chartContainer).toBeTruthy();
    });

    it('should render with fetchDataError', async () => {
        api.fetchCall = jest.fn()
            .mockRejectedValueOnce({
                message: 'ERROR'
            })

        render(<StackedBarChartCallDetails /> );
        const message = await screen.findByTestId('no-data')
        expect(message).toHaveTextContent('No Data Found');
    });

    it('should render with no data', async () => {
        api.fetchCall = jest.fn()
            .mockResolvedValue({
                records: []
            })

        const tree = render(<StackedBarChartCallDetails /> );
        const message = await tree.findByTestId('no-data')
        expect(message).toHaveTextContent('No Data Found');
    });

    it('shold call fetchCalldata', async  () => {
        NativeModules.ReachabilityBridge = {
            networkReachabilityStatus: jest.fn()
                .mockRejectedValue('ERROR')
        }

        render(<StackedBarChartCallDetails/> );
        fireEvent.press(screen.UNSAFE_getByType(IconButton));
        expect(api.fetchCall).toHaveBeenCalled();
    })

    it('shold call logACall', async  () => {
        navigator.navigate = jest.fn().mockImplementation(() => Promise.resolve({}));

        render(<StackedBarChartCallDetails/> );
        fireEvent.press(screen.UNSAFE_getByType(Button));
        expect(navigator.navigate).toHaveBeenCalledTimes(1);
    })

    it('shold call logACall with error', async  () => {
        navigator.navigate = jest.fn().mockImplementation(() => {
            throw new Error('Error message');
        });

        render(<StackedBarChartCallDetails/> );
        fireEvent.press(screen.UNSAFE_getByType(Button));
        expect(navigator.navigate).toHaveBeenCalled();
    })
});
