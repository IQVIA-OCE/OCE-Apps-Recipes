import React from 'react';
import LineChartTRXDetails from './index';
import api from '../api/api';
import { act, fireEvent, render } from '@testing-library/react-native';
import { IconButton } from "@oce-apps/apollo-react-native";

const MARKETS_MOCK = {
    records: [{
        OCE__Market__c: '"DIABETES"'
    }]
};

const MARKET_MOCK = {
    records: [{
        "OCE__Measure1Bucket01__c":13,
        "OCE__Measure1Bucket02__c":6,
        "OCE__Measure1Bucket03__c":1,
        "OCE__Measure1Bucket04__c":3,
        "OCE__Measure1Bucket05__c":5,
        "OCE__Measure1Bucket06__c":4,
        "OCE__Measure1Bucket07__c":1,
        "OCE__Measure1Bucket08__c":1,
        "OCE__Measure1Bucket09__c":7,
        "OCE__Measure1Bucket10__c":3,
        "OCE__Measure1Bucket11__c":5,
        "OCE__Measure1Bucket12__c":0,
        "OCE__Measure1Bucket13__c":1,
        "OCE__Measure1Bucket14__c":6,
        "OCE__Measure1Bucket15__c":0,
        "OCE__Measure1Bucket16__c":3,
        "OCE__Measure1Bucket17__c":5,
        "OCE__Measure1Bucket18__c":2,
        "OCE__Measure1Bucket19__c":4,
        "OCE__Measure1Bucket20__c":1,
        "OCE__Measure1Bucket21__c":1,
        "OCE__Measure1Bucket22__c":4,
        "OCE__Measure1Bucket23__c":3,
        "OCE__Measure1Bucket24__c":1,
        "OCE__Measure1Bucket25__c":1,
        "OCE__Measure1Bucket26__c":6,
        "OCE__PeriodLabelBucket01__c":"Apr-11",
        "OCE__PeriodLabelBucket02__c":"May-11",
        "OCE__PeriodLabelBucket03__c":"Jun-11",
        "OCE__PeriodLabelBucket04__c":"Jul-11",
        "OCE__PeriodLabelBucket05__c":"Aug-11",
        "OCE__PeriodLabelBucket06__c":"Sep-11",
        "OCE__PeriodLabelBucket07__c":"Oct-11",
        "OCE__PeriodLabelBucket08__c":"Dec-11",
        "OCE__PeriodLabelBucket09__c":"Jan-12",
        "OCE__PeriodLabelBucket10__c":"Mar-12",
        "OCE__PeriodLabelBucket11__c":"Jun-12",
        "OCE__PeriodLabelBucket12__c":"Nov-12",
        "OCE__PeriodLabelBucket13__c":"Feb-13",
        "OCE__PeriodLabelBucket14__c":"Nov-11",
        "OCE__PeriodLabelBucket15__c":"Feb-12",
        "OCE__PeriodLabelBucket16__c":"Apr-12",
        "OCE__PeriodLabelBucket17__c":"May-12",
        "OCE__PeriodLabelBucket18__c":"Jul-12",
        "OCE__PeriodLabelBucket19__c":"Aug-12",
        "OCE__PeriodLabelBucket20__c":"Sep-12",
        "OCE__PeriodLabelBucket21__c":"Oct-12",
        "OCE__PeriodLabelBucket22__c":"Dec-12",
        "OCE__PeriodLabelBucket23__c":"Jan-13",
        "OCE__PeriodLabelBucket24__c":"Mar-13",
        "OCE__PeriodLabelBucket25__c":"Apr-13",
        "OCE__PeriodLabelBucket26__c":"Mar-11",
        "OCE__Product__r": {
            "Name":"PROZALAND"
        }
    }]
}

jest.mock('../api/api', () => ({
    fetchMarkets: jest.fn().mockResolvedValue(MARKETS_MOCK),
    fetchMarketData: jest.fn().mockResolvedValue(MARKET_MOCK),
}));



describe('LineChartTRXDetails', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render properly', async () => {
        const tree = render(<LineChartTRXDetails /> );
        expect(tree).toBeTruthy();
    });

    it('should call fetchMarketsList', async () => {
        const tree = render(<LineChartTRXDetails recordId="123"/> );
        await act(() => Promise.resolve());

        await act(async () => {
            fireEvent.press(tree.UNSAFE_getAllByType(IconButton)[0]);
        });
        expect(api.fetchMarkets).toHaveBeenCalledTimes(1)
    });

    it('should call fetchMarketsList with no data', async () => {
        api.fetchMarketData = jest.fn()
            .mockResolvedValueOnce({
                records: []
            });

        const tree = render(<LineChartTRXDetails /> );
        expect(tree).toBeTruthy();
    });

    it('should call fetchMarketsList with error', async () => {
        api.fetchMarketData = jest.fn()
            .mockRejectedValue({
                message: 'ERROR'
            });

        render(<LineChartTRXDetails /> );
    });
});
