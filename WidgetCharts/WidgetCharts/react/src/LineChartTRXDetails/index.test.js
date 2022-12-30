import React from 'react';
import LineChartTRXDetails from './index';
import { sfNetAPI} from 'oce-apps-bridges';
import { fireEvent, render, screen } from "@testing-library/react-native";
import { IconButton } from "apollo-react-native";

describe('LineChartTRXDetails', () => {
    beforeAll(() => {
        jest.useFakeTimers();
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    it('should render properly', async () => {
        const tree = render(<LineChartTRXDetails /> );
        expect(tree).toBeTruthy();
    });

    it('should call fetchMarketsList', async () => {
        sfNetAPI.query = jest.fn()
            .mockImplementationOnce((query, cb, err) => {
                cb({
                    records: [{
                        OCE__Market__c: 'TEST'
                    }]
                })
            })

        render(<LineChartTRXDetails recordId="123"/> );
        fireEvent.press(screen.UNSAFE_getAllByType(IconButton)[0]);
        expect(sfNetAPI.query).toHaveBeenCalledTimes(1);
    });

    it('should call fetchMarketsList with no data', async () => {
        sfNetAPI.query = jest.fn()
            .mockImplementationOnce((query, cb, err) => {
                cb({
                    records: []
                })
            });
        const tree = render(<LineChartTRXDetails /> );
        expect(tree).toBeTruthy();
    });

    it('should call fetchMarketsList with error', async () => {
        sfNetAPI.query = jest.fn()
            .mockImplementationOnce((query, cb, err) => {
                err({
                    message: 'ERROR'
                })
            });

        render(<LineChartTRXDetails /> );
    });
});
