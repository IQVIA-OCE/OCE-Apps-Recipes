import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { render, act, fireEvent } from '@testing-library/react-native';
import { LOADING_STATUS } from "../../constants";
import { DTPAllocationReport } from './DTPAllocationReport'
import { REPORT_LIMIT } from '../../store/Search/SearchSlice'
import { testProductAllocationData, mappedProductAllocationData } from '../../__mocks__/testData';


jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
}));

jest.mock('@oce-apps/oce-apps-bridges', () => ({
    environment: {
        locale: () => '',
        namespace: () => '',
        territory: () => '',
        userId: () => ''
    }
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
    it('should render DTPAllocationReport correctly with loader', async () => {
        useSelector.mockImplementation((cb) =>
            cb({
                productAllocationReport: {
                    loadingStatus: LOADING_STATUS.BOOTSTRAPPING,
                    productAllocationRecords: mappedProductAllocationData,
                    productAllocationTotalRecords: 2,
                    error: null,
                },
                search: {
                    params: {
                        limit: REPORT_LIMIT,
                        offset: 0,
                        searchQuery: '',
                        searchField: ''
                    },
                    activeScreen: 'dtp'
                },
            })
        );
        const { getByTestId } = render(<DTPAllocationReport navigation={navigation} />);
        const reportList = getByTestId('reportsList');
        expect(reportList).toBeTruthy();
    });
    it('should render DTPAllocationReport correctly', async () => {
        useSelector.mockImplementation((cb) =>
            cb({
                productAllocationReport: {
                    loadingStatus: LOADING_STATUS.PENDING,
                    productAllocationRecords: mappedProductAllocationData,
                    productAllocationTotalRecords: 2,
                    error: null,
                },
                search: {
                    params: {
                        limit: REPORT_LIMIT,
                        offset: 0,
                        searchQuery: '',
                        searchField: ''
                    },
                    activeScreen: 'dtp'
                },
            })
        );
        const { getByTestId, getAllByTestId } = render(<DTPAllocationReport navigation={navigation} />);
        const dtpAllocationContainer = getByTestId('dtpAllocationContainer');
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
            expect(getAllByTestId('tableListItem').length).toBe(mappedProductAllocationData.length)

        });
        expect(getByTestId('sortIcon_0')).toBeTruthy();
        expect(reportList).toBeTruthy();
        expect(dtpAllocationContainer).toBeTruthy();
        fireEvent.press(getByTestId('sortColumn_0'));
        expect(reportList).toBeTruthy();
        fireEvent.press(getAllByTestId('childRowItem_0')[0]);
    });
});
