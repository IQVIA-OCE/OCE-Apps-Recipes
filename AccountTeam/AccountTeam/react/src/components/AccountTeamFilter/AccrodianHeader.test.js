import React from 'react'
import { useDispatch } from 'react-redux';
import { render } from '@testing-library/react-native'
import { AccrodianHeader } from './AccrodianHeader'


jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
}));

const dispatch = jest.fn();

describe('AccrodianHeader', () => {
    beforeEach(() => {
        useDispatch.mockImplementation(() => dispatch);
    });
    it("should render AccrodianHeader properly", async () => {
        const { getByTestId, UNSAFE_getByType } = render(<AccrodianHeader title={'Filter'} expanded={true} />)

    })
})