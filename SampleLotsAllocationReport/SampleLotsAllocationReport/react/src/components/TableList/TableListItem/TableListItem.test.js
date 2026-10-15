import React from 'react';
import { render, fireEvent } from '@testing-library/react-native'
import { navigator } from "@oce-apps/oce-apps-bridges";
import { TableListItem } from "./TableListItem";
import { REPORT_TABLE_TITLES } from '../../../constants/tableTitles';
import { mappedReports, mappedTransactions } from "../../../__mocks__/testData";

import { useDispatch } from 'react-redux';

jest.mock('@oce-apps/oce-apps-bridges', () => ({
    environment: {
        locale: () => '',
        namespace: () => '',
        territory: () => '',
        userId: () => ''
    },
    navigator: {
        navigate: jest.fn()
    }
}));

const dispatch = jest.fn();

jest.mock('react-redux', () => ({
    useDispatch: jest.fn(),
}));

const navigation = {
    addListener: jest.fn().mockImplementation((_, fn) => fn()),
    getParam: jest
        .fn()
        .mockImplementation(() => false),
    navigate: jest.fn(),
};

describe('TableListItem', () => {
    beforeEach(() => {
        useDispatch.mockImplementation(() => dispatch);
    });
    it('should render TableListItem component  on parent Table', () => {
        const onRowPress = jest.fn();
        const testTableData = ['ADRAVIL TAB 10 MG Physical']
        const dataObj = { childRows: [{ lotName: '6446-2', allocatedQuantity: 0, remainingQuantity: 0 }], isGrouped: true };
        const { getByTestId } = render(
            <TableListItem tableHeaders={REPORT_TABLE_TITLES} tableData={testTableData} dataObj={dataObj} onRowPress={onRowPress} isParent />
        );

        const row = getByTestId('childRowItem_0')
        expect(row).toBeTruthy();
        fireEvent.press(row);
        expect(onRowPress).toHaveBeenCalledTimes(1);
    });
    it('should render TableListItem component  on child Table', () => {
        const onRowPress = jest.fn();
        const { getByTestId } = render(
            <TableListItem tableData={mappedTransactions[0]} onRowPress={onRowPress} />
        );

        const row = getByTestId('deepLinkFields_0')
        fireEvent.press(row);
        expect(row).toBeTruthy();
        expect(onRowPress).toHaveBeenCalledTimes(0);
        expect(navigator.navigate).toHaveBeenCalledTimes(1);
    });
});
