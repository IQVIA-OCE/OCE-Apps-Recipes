import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { useDispatch, useSelector } from 'react-redux';
import { TransactionReportScreen } from './TransactionReportScreen'
import { LOADING_STATUS } from "../../constants";
import { REPORT_LIMIT } from "../../store/Search/SearchSlice";
import { mappedTransactions } from '../../__mocks__/testData';



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
    fetchTransactionReportList: jest.fn(),
    fetchMoreTransactionReportList: jest.fn()

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

describe('TransactionReportScreen', () => {

    beforeEach(() => {
        useDispatch.mockImplementation(() => dispatch);
        useSelector.mockImplementation((cb) =>
            cb({
                transactionReport: {
                    loadingStatus: LOADING_STATUS.BOOTSTRAPPING,
                    transactionReportRecords: mappedTransactions,
                    error: null,
                },
                search: {
                    params: {
                        limit: REPORT_LIMIT,
                        offset: 0,
                        searchQuery: '',
                        searchField: ''
                    },
                    activeScreen: 'transaction'
                }
            })
        );
    });
    it('should render TransactionReportScreen correctly', async () => {
        const { getByTestId, getAllByTestId } = render(<TransactionReportScreen navigation={navigation} />);
        const sampleLotsContainer = getByTestId('transactionReportContainer');
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
            expect(getAllByTestId('tableListItem').length).toBe(mappedTransactions.length)

        });
        expect(getByTestId('sortIcon_0')).toBeTruthy();
        expect(reportList).toBeTruthy();
        fireEvent.press(getByTestId('sortColumn_0'));
        expect(reportList).toBeTruthy();
        expect(sampleLotsContainer).toBeTruthy();
    });
    it('should not fetch fetchTransactionReportList if active screen is not transaction', async () => {
        useSelector.mockImplementation((cb) =>
            cb({
                transactionReport: {
                    loadingStatus: LOADING_STATUS.BOOTSTRAPPING,
                    transactionReportRecords: mappedTransactions,
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
        const { getByTestId } = render(<TransactionReportScreen navigation={navigation} />);
        const transactionReportContainer = getByTestId('transactionReportContainer');
        expect(transactionReportContainer).toBeTruthy();
    });
    it('should navigate to report screen on tap of back button', async () => {
        const { getByText } = render(<TransactionReportScreen navigation={navigation} />);
        const backButton = getByText('Go back')
        fireEvent.press(backButton);
        expect(backButton).toBeTruthy();
        expect(navigation.goBack).toHaveBeenCalledTimes(1);

    });
});
