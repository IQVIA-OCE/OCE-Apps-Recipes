import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { ListItem } from './ListItem'
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import { SORT_OPTION_LIST } from '../../constants'

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'MaterialIcon')

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
}));

const dispatch = jest.fn();

describe('ListItem', () => {
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

    it("should render ListItem properly", () => {
        const data = {
            Id: 1,
            value: 'userName',
            label: 'User Name'
        }
        const { getByTestId, queryByTestId } = render(
            <ListItem item={data} index={0} />)
        const container = getByTestId('sortListContainer_0');
        const touchableItem = getByTestId('sortListItem_0');
        fireEvent.press(touchableItem);
        waitFor(() => expect(queryByTestId('sortListLabel_0')).toBeTruthy())
        expect(container.props.style[1].borderBottomWidth).toBe(1);
        expect(getByTestId('sortListLabel_0').props.children).toBe('User Name')
    })
    it("should render ListItem and should display border for all the elements expect the last one", () => {
        useSelector.mockImplementation((cb) =>
            cb({
                sortList: {
                    sortOption: null,
                    sortOrder: 'asc',
                    sortListData: [{
                        Id: 1,
                        value: 'userName',
                        label: 'User Name'
                    }],
                },
            })
        );
        const data = {
            Id: 1,
            value: 'userName',
            label: 'User Name'
        }
        const { getByTestId } = render(
            <ListItem item={data} index={0} />)
        const container = getByTestId('sortListContainer_0');
        expect(container.props.style[1].borderBottomWidth).toBe(0);
    })
    it("should render ListItem and should  display check icon if value is selected", () => {
        useSelector.mockImplementation((cb) =>
            cb({
                sortList: {
                    sortOption: {
                        Id: 1,
                        value: 'userName',
                        label: 'User Name'
                    },
                    sortOrder: 'asc',
                    sortListData: [{
                        Id: 1,
                        value: 'userName',
                        label: 'User Name'
                    }],
                },
            })
        );
        const data = {
            Id: 1,
            value: 'userName',
            label: 'User Name'
        }
        const { getByTestId } = render(
            <ListItem item={data} index={0} />)
        expect(getByTestId('sortListIcon_0').props.name).toEqual('check')

    })
    it("should render ListItem and should not display check icon if not selection", () => {
        const data = {
            Id: 1,
            value: 'userName',
            label: 'User Name'
        }
        const { getByTestId } = render(
            <ListItem item={data} index={0} />)
        const iconBtn = getByTestId('sortListIcon_0');
        expect(iconBtn.props.name).toEqual(null)
    })
})



