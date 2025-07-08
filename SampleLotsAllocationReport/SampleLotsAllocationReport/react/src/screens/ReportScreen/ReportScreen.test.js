import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { ReportScreen } from './ReportScreen';
import { LOADING_STATUS } from "../../constants";
import { REPORT_LIMIT } from "../../store/SamplesLotAllocationReport/SamplesLotAllocationReportSlice";
import { testProductAllocationData, testSamplesLotReportRecords } from '../../__mocks__/testData';




jest.mock('@oce-apps/oce-apps-bridges', () => ({
    sfNetAPI: {
        enablePromises: jest.fn()
    },
    environment: {
        locale: () => '',
        namespace: () => '',
        territory: () => '',
        userId: () => ''
    },
}));

const navigation = {
    addListener: jest.fn().mockImplementation((_, fn) => fn()),
    getParam: jest
        .fn()
        .mockImplementation(() => false),
    navigate: jest.fn(),
};

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
}));

jest.mock('../../api/reportApi');

jest.mock('../../store/SamplesLotAllocationReport/SamplesLotAllocationReportSlice', () => ({
    bootstrap: jest.fn(),
    setSearchQuery: jest.fn(),
    setSearchField: jest.fn(),
    fetchTotalRecords: jest.fn()
}));


const dispatch = jest.fn();


describe('ReportScreen', () => {
    beforeEach(() => {
        useDispatch.mockImplementation(() => dispatch);
        useSelector.mockImplementation((cb) =>
            cb({
                samplesLotAllocationReport: {
                    loadingStatus: LOADING_STATUS.BOOTSTRAPPING,
                    sampleLotsRecords: testSamplesLotReportRecords,
                    totalNumberOfRecords: 2,
                    error: null,
                },
                search: {
                    params: {
                        limit: REPORT_LIMIT,
                        offset: 0,
                        searchQuery: '',
                        searchField: ''
                    },
                },
                productAllocationReport: {
                    loadingStatus: LOADING_STATUS.BOOTSTRAPPING,
                    productAllocationRecords: testProductAllocationData,
                    productAllocationTotalRecords: 2,
                    error: null,
                }
            })
        );
    });


    it('should render tabs correctly', () => {
        useSelector.mockImplementation((cb) =>
            cb({
                samplesLotAllocationReport: {
                    loadingStatus: LOADING_STATUS.PENDING,
                    sampleLotsRecords: testSamplesLotReportRecords,
                    totalNumberOfRecords: 0,
                    error: null,
                },
                search: {
                    params: {
                        limit: REPORT_LIMIT,
                        offset: 0,
                        searchQuery: '',
                        searchField: ''
                    },
                },
                productAllocationReport: {
                    loadingStatus: LOADING_STATUS.BOOTSTRAPPING,
                    productAllocationRecords: testProductAllocationData,
                    productAllocationTotalRecords: 2,
                    error: null,
                }
            })
        );
        const { getByText } = render(<ReportScreen />);
        const sampleLotsTab = getByText('Sample Lots');
        expect(sampleLotsTab).toBeTruthy();
        const dtpAllocation = getByText('Product Allocation (DTP)');
        expect(dtpAllocation).toBeTruthy();
    });

    it('should switch tabs and display the contents correctly', () => {
        const { getByText, getByTestId } = render(<ReportScreen />);
        const sampleLotsTab = getByText('Sample Lots');
        expect(sampleLotsTab).toBeTruthy();
        fireEvent.press(sampleLotsTab);
        expect(getByTestId("sampleLotReportContainer")).toBeTruthy();
        const dtpAllocationTab = getByText('Product Allocation (DTP)');
        expect(dtpAllocationTab).toBeTruthy();
        fireEvent.press(dtpAllocationTab);
        expect(getByTestId("dtpAllocationContainer")).toBeTruthy();
    });
});
