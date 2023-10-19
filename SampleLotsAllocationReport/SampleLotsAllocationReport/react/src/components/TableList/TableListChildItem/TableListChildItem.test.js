import React from 'react';
import { render } from '@testing-library/react-native';
import { REPORT_TABLE_TITLES } from "../../../constants/tableTitles";
import { TableListChildItem } from "./TableListChildItem";

jest.mock('oce-apps-bridges', () => ({
    environment: {
        locale: () => '',
        namespace: () => '',
    },
}))

describe('TableListChildItem', () => {
    it('should render TableListChildItem component', () => {
        const data = {
            allocatedQuantity: 0,
            lotName: "2342-1",
            remainingQuantity: 0,
            reportId: "a5g0k000000B5xUAAS"
        }
        const onRowPress = jest.fn();
        const { getByText } = render(
            <TableListChildItem data={data} tableHeaders={REPORT_TABLE_TITLES} index={0} onRowPress={onRowPress} />
        );
        expect(getByText('2342-1')).toBeTruthy();
    });
    it('should render TableListChildItem component with white color as background', () => {
        const data = {
            allocatedQuantity: 0,
            lotName: "2342-2",
            remainingQuantity: 0,
            reportId: "a5g0k000000B5xUAAS"
        }
        const onRowPress = jest.fn();
        const { getByText } = render(
            <TableListChildItem data={data} tableHeaders={REPORT_TABLE_TITLES} index={1} onRowPress={onRowPress} />
        );
        expect(getByText('2342-2')).toBeTruthy();
    });
});
