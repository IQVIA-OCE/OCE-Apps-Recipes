import React from 'react';
import ModalHeader from './ModalHeader';
import renderer from 'react-test-renderer';
import { useSelector, useDispatch } from 'react-redux';
import { records } from "../../../constants/mockData";

jest.useFakeTimers();


jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));

jest.mock("../../../../bridge/Localization/localization.native");

describe('Modal Header', () => {
    it('ModalHeader Component should render properly', () => {
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            meeting: {
                meetingInfo: records,
                signature: null
            }
        }));
        const tree = renderer.create(
            <ModalHeader />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    })

});
