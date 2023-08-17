import React from 'react';
import { render, act, fireEvent } from '@testing-library/react-native'
import { REPORT_TABLE_TITLES } from "../../constants";
import { mappedReports } from "../../__mocks__/testData";
import { TableList } from "./TableList";

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

const dispatch = jest.fn();

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
}));

jest.mock('../../store/SamplesLotAllocationReport/SamplesLotAllocationReportSlice', () => ({
    bootstrap: jest.fn(),
    fetchMoreReportData: jest.fn(),
    fetchTotalRecords: jest.fn()
}));

describe('TableList', () => {

    it('should render TableList', async () => {

        const headers = Object.keys(REPORT_TABLE_TITLES);
        const onFetchMoreData = jest.fn();
        const onFetchData = jest.fn();
        const onPressRowItem = jest.fn();
        const { getByTestId, getAllByTestId } = render(<TableList
            isLoading={false}
            listData={mappedReports}
            onFetchMoreData={onFetchMoreData}
            onFetchData={onFetchData}
            onPressRowItem={onPressRowItem}
            tableHeaders={headers} isParent />);

        const reportList = getByTestId('reportsList');
        expect(reportList).toBeTruthy();
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
    });
});

