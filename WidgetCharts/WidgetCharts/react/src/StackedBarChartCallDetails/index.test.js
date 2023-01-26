import React from 'react';
import StackedBarChartCallDetails from './index';
import { sfNetAPI, navigator} from 'oce-apps-bridges';
import moment from 'moment';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { Button, IconButton } from 'apollo-react-native';
import {NativeModules} from "react-native";

jest.mock('moment', () => () => ({
    format: () => "2001-05-01T00:00:00.000",
    subtract: () => "2001-05-01T00:00:00.000",
    add: jest.fn().mockReturnThis(),
    isValid: jest.fn().mockReturnValue(true)
}));

describe('StackedBarChartCallDetails', () => {
    beforeAll(() => {
        jest.useFakeTimers();
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    it('should render properly', async () => {
        sfNetAPI.query = jest.fn()
            .mockImplementationOnce((query, cb) => {
                cb({
                    records: [{
                        OCE__CallDateTime__c: 'Tue May 1 2020 16:31:00 GMT+0300 (Eastern European Summer Time)'
                    }]
                })
            })

        const tree = render(<StackedBarChartCallDetails /> );
        expect(tree).toBeTruthy();
    });

    it('should render with fetchDataError', async () => {
        sfNetAPI.query = jest.fn()
            .mockImplementationOnce((query, cb, err) => {
                err({
                    message: 'ERROR'
                })
            })

        const tree = render(<StackedBarChartCallDetails /> );
        expect(tree).toBeTruthy();
    });

    it('should render with no data', async () => {
        sfNetAPI.query = jest.fn()
            .mockImplementationOnce((query, cb) => {
                cb({
                    records: []
                })
            })

        const tree = render(<StackedBarChartCallDetails /> );
        expect(tree).toBeTruthy();
    });

    it('shold call fetchCalldata', async  () => {
        sfNetAPI.query = jest.fn()
            .mockImplementationOnce((query, cb) => {
                cb({
                    records: [{
                        OCE__CallDateTime__c: 'Tue May 1 2020 16:31:00 GMT+0300 (Eastern European Summer Time)'
                    }]
                })
            })

        NativeModules.ReachabilityBridge = {
            networkReachabilityStatus: jest.fn()
                .mockRejectedValue('ERROR')
        }

        render(<StackedBarChartCallDetails/> );
        fireEvent.press(screen.UNSAFE_getByType(IconButton));
        expect(sfNetAPI.query).toHaveBeenCalled();
    })

    it('shold call logACall', async  () => {
        navigator.dispatch = jest.fn().mockImplementation(() => Promise.resolve({}));

        render(<StackedBarChartCallDetails/> );
        fireEvent.press(screen.UNSAFE_getByType(Button));
        expect(navigator.dispatch).toHaveBeenCalledTimes(1);
    })

    it('shold call logACall with error', async  () => {
        navigator.dispatch = jest.fn().mockRejectedValueOnce(new Error('Error message'));

        render(<StackedBarChartCallDetails/> );
        fireEvent.press(screen.UNSAFE_getByType(Button));
        expect(navigator.dispatch).toHaveBeenCalled();
    })
});
