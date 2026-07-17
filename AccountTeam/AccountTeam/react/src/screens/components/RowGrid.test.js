import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { render } from '@testing-library/react-native'
import { RowGrid } from './RowGrid'
import { SORT_OPTION_LIST } from '../../constants'

describe('RowGrid', () => {
    it("should render RowGrid properly", () => {
        const primaryAccessor = 'Name';
        const primaryValue = 'Admin';
        const secondaryAccessor = 'Email';
        const secondaryValue = 'test@test.com';
        const isSecondary = true;
        const { getByTestId } = render(
            <RowGrid primaryAccessor={primaryAccessor} isSecondary={isSecondary} primaryValue={primaryValue} secondaryAccessor={secondaryAccessor} secondaryValue={secondaryValue} />)
        expect(getByTestId('rowGridContainer')).toBeTruthy();
        expect(getByTestId('firstCellContainer')).toBeTruthy();
        expect(getByTestId('secondCellContainer')).toBeTruthy();
    })
    it("should render RowGrid properly without secondary grid", () => {
        const primaryAccessor = 'Name';
        const primaryValue = 'Admin';
        const secondaryAccessor = 'Email';
        const secondaryValue = 'test@test.com';
        const { getByTestId, queryByTestId } = render(
            <RowGrid primaryAccessor={primaryAccessor} primaryValue={primaryValue} secondaryAccessor={secondaryAccessor} secondaryValue={secondaryValue} />)
        expect(getByTestId('rowGridContainer')).toBeTruthy();
        expect(getByTestId('firstCellContainer')).toBeTruthy();
        expect(queryByTestId('secondCellContainer')).toBeNull();
    })
})