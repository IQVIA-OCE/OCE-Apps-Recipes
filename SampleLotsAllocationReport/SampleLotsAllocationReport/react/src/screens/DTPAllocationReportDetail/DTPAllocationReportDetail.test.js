import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { useDispatch, useSelector } from 'react-redux';
import { DTPAllocationReportDetail } from './DTPAllocationReportDetail'
import { LOADING_STATUS } from "../../constants";
import { REPORT_LIMIT } from "../../store/Search/SearchSlice";
import { mappedProductAllocationDetailData } from '../../__mocks__/testData';



jest.mock('oce-apps-bridges', () => ({
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

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
}));

jest.mock('../../api/reportApi');

jest.mock('../../store/TransactionReport/TransactionReportSlice', () => ({
    fetchDTPDetailReport: jest.fn()
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

describe('DTPAllocationReportDetail', () => {

    beforeEach(() => {
        useDispatch.mockImplementation(() => dispatch);
        useSelector.mockImplementation((cb) =>
            cb({
                productAllocationDetailReport: {
                    loadingStatus: LOADING_STATUS.BOOTSTRAPPING,
                    productAllocationDetailRecords: mappedProductAllocationDetailData,
                    error: null,
                },
                search: {
                    params: {
                        limit: REPORT_LIMIT,
                        offset: 0,
                        searchQuery: '',
                        searchField: ''
                    },
                    activeScreen: 'dtpDetail'
                }
            })
        );
    });
    it('should render DTPAllocationReportDetail correctly', async () => {
        const { getByTestId, getAllByTestId } = render(<DTPAllocationReportDetail navigation={navigation} />);
        const dtpDetailsContainer = getByTestId('DTPAllocationReportDetailContainer');
        const reportList = getByTestId('reportsList');
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
            expect(getAllByTestId('tableListItem').length).toBe(mappedProductAllocationDetailData.length)

        });
        expect(reportList).toBeTruthy();
        expect(dtpDetailsContainer).toBeTruthy();
    });
    it('should render sort the list correctly', async () => {
        const { getByTestId } = render(<DTPAllocationReportDetail navigation={navigation} />);
        const reportList = getByTestId('reportsList');
        const sortColumn = getByTestId('sortColumn_0');
        fireEvent.press(sortColumn);
        expect(reportList).toBeTruthy();
        fireEvent.press(sortColumn);
        expect(reportList).toBeTruthy();

    });
    it('should not fetch fetchDTPDetailReport if active screen is not dtpDetail', async () => {
        useSelector.mockImplementation((cb) =>
            cb({
                productAllocationDetailReport: {
                    loadingStatus: LOADING_STATUS.BOOTSTRAPPING,
                    productAllocationDetailRecords: mappedProductAllocationDetailData,
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
        const { getByTestId } = render(<DTPAllocationReportDetail navigation={navigation} />);
        const dtpDetailsContainer = getByTestId('DTPAllocationReportDetailContainer');
        expect(dtpDetailsContainer).toBeTruthy();
    });
    it('should navigate to report screen on tap of back button', () => {
        const { getByText } = render(<DTPAllocationReportDetail navigation={navigation} />);
        const backButton = getByText('Go back')
        expect(backButton).toBeTruthy();
        fireEvent.press(backButton);
        expect(navigation.goBack).toHaveBeenCalledTimes(1);
    });
});
