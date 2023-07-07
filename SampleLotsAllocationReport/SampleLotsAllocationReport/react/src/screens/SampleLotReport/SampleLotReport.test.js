import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SampleLotReport } from './SampleLotReport'
import { TableList } from '../../components/TableList/TableList'
import { LOADING_STATUS } from "../../constants";
import { REPORT_LIMIT } from "../../store/SamplesLotAllocationReport/SamplesLotAllocationReportSlice";
import { mappedReports } from '../../__mocks__/testData';


jest.mock('oce-apps-bridges', () => ({
    sfNetAPI: {
        enablePromises: jest.fn()
    },
    environment: {
        locale: () => '',
        namespace: () => '',
        territory: () => '',
        userId: () => '',
    },
}));

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
}));

jest.mock('../../api/reportApi');

jest.mock('../../store/SamplesLotAllocationReport/SamplesLotAllocationReportSlice', () => ({
    bootstrap: jest.fn(),
    fetchTotalRecords: jest.fn(),
    fetchMoreReportData: jest.fn(),
    setReportId: jest.fn()
}));


const navigation = {
    addListener: jest.fn().mockImplementation((_, fn) => fn()),
    getParam: jest
        .fn()
        .mockImplementation(() => false),
    navigate: jest.fn(),
    goBack: jest.fn(),
};

const dispatch = jest.fn();

describe('ReportScreen', () => {

    beforeEach(() => {
        useDispatch.mockImplementation(() => dispatch);
        useSelector.mockImplementation((cb) =>
            cb({
                samplesLotAllocationReport: {
                    loadingStatus: LOADING_STATUS.BOOTSTRAPPING,
                    sampleLotsRecords: mappedReports,
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
                    activeScreen: 'sla'
                }
            })
        );
    });
    it('should render SampleLotReport correctly', async () => {
        const { getByTestId, getAllByTestId } = render(<SampleLotReport navigation={navigation} />);
        const sampleLotsContainer = getByTestId('sampleLotReportContainer');
        const reportList = getByTestId('reportsList');
        fireEvent.press(getByTestId('sortColumn_0'));
        await act(async () => {
            fireEvent(getByTestId('reportsList'), 'layout', {
                nativeEvent: { layout: { height: 100 } },
            });
            fireEvent.scroll(getByTestId('reportsList'), {
                nativeEvent: {
                    contentSize: { height: 600, width: 400 },
                    contentOffset: { y: 150, x: 0 },
                    layoutMeasurement: { height: 100, width: 100 }
                }
            })
            reportList.props.onRefresh();
            reportList.props.onEndReached();
            reportList.props.keyExtractor(() => 1)
            expect(getAllByTestId('tableListItem').length).toBe(mappedReports.length)

        });
        expect(getByTestId('sortIcon_0')).toBeTruthy();
        expect(reportList).toBeTruthy();
        expect(sampleLotsContainer).toBeTruthy();
        fireEvent.press(getAllByTestId('childRowItem_0')[0]);
    });
    it('should render table data with more records', async () => {
        const { getByTestId, getAllByTestId } = render(<SampleLotReport />);
        const sampleLotsContainer = getByTestId('sampleLotReportContainer');
        expect(sampleLotsContainer).toBeTruthy();

        const reportList = getByTestId('reportsList');
        expect(reportList).toBeTruthy();
        await act(async () => {
            reportList.props.onEndReached();
            expect(getAllByTestId('tableListItem').length).toBe(mappedReports.length)

        });



    });
});
