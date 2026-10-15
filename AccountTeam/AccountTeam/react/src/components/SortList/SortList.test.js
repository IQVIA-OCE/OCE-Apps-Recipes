import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { render } from '@testing-library/react-native'
import { SortList } from './SortList'
import { SORT_OPTION_LIST } from '../../constants'

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
}));


const dispatch = jest.fn();

describe('SortList', () => {
    beforeEach(() => {
        useDispatch.mockImplementation(() => dispatch);
        useSelector.mockImplementation((cb) =>
            cb({
                sortList: {
                    sortOption: null,
                    sortOrder: 'asc',
                    sortListData: SORT_OPTION_LIST,
                },
            })
        );
    });
    it("should render SortList properly", () => {
        const data = [{
            Id: 1,
            value: 'userName',
            label: 'User Name'
        }, {
            Id: 2,
            value: 'territoryName',
            label: 'Territory Name'
        }]
        const { getByTestId } = render(
            <SortList data={data} selectedSortItem={data[0]} />)
        expect(getByTestId('sortOptionList')).toBeTruthy();

    })
})