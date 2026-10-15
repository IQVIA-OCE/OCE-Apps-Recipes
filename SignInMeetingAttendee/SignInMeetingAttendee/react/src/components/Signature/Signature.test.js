import React from 'react';
import Signature from './Signature';
import { render } from '@testing-library/react-native';
import { useSelector, useDispatch } from 'react-redux';
import { records, meetingLevelConfigRecord, meetingMemberLayout } from "../../constants/mockData";
import { environment } from '@oce-apps/oce-apps-bridges';
import * as commonConstants from '../../constants'

jest.useFakeTimers();

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));

describe('Signature Widget', () => {
    it('Signature widget should render properly', () => {
        environment.namespace = jest.fn().mockReturnValue('OCE__');
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            meeting: {
                meetingDetails: records,
                meetingConfig: meetingLevelConfigRecord,
            }
        }));
        const tree = render(
            <Signature />
        );

        expect(tree).toBeTruthy();
    })
    it('Signature widget should render properly in iphone', () => {
        commonConstants.isIphone = false;
        environment.namespace = jest.fn().mockReturnValue('OCE__');
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            meeting: {
                meetingDetails: records,
                meetingConfig: meetingLevelConfigRecord,
                meetingLayouts: meetingMemberLayout
            }
        }));
        const tree = render(
            <Signature />
        );

        expect(tree).toBeTruthy();
    })

});
