import React from 'react'
import { render, act, fireEvent } from '@testing-library/react-native'
import { TeamList } from './TeamList'
import { Provider } from 'react-redux';

import { useDispatch, useSelector } from 'react-redux';
import { store } from '../../store/store'; import {
    teamMembers
} from '../../constants/mockData'


jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
}));


const dispatch = jest.fn();

describe('ListRow', () => {
    beforeEach(() => {
        useDispatch.mockImplementation(() => dispatch);
        useSelector.mockImplementation((cb) =>
            cb({
                sortList: {
                    shouldShowSortList: true
                },
                account: {
                    shouldShowDetailScreen: true,
                    params: {
                        searchQuery: ''
                    }
                }
            })
        );
    });
    it("should render TeamList properly", async () => {
        const { getByTestId } = render(<TeamList />)
        expect(getByTestId('teamListContainer')).toBeTruthy();
        const list = getByTestId('teamList');
        await act(async () => {
            fireEvent(getByTestId('teamListContainer'), 'layout', {
                nativeEvent: { layout: { height: 100 } },
            });
            fireEvent.scroll(getByTestId('teamList'), {
                nativeEvent: {
                    contentSize: { height: 600, width: 400 },
                    contentOffset: { y: 150, x: 0 },
                    layoutMeasurement: { height: 100, width: 100 } // Dimensions of the device
                }
            })
            list.props.onEndReached();
            list.props.renderItem({ item: teamMembers[0] });
            list.props.ItemSeparatorComponent(() => jest.fn());
            list.props.keyExtractor(() => 1)
        });
    })
})
