import React from 'react';
import Signature from './Signature';
import renderer from 'react-test-renderer';
import { useSelector, useDispatch } from 'react-redux';
import { records, meetingLevelConfigRecord } from "../../constants/mockData";
import { environment } from '../../../bridge/EnvironmentData/EnvironmentData.native';


jest.useFakeTimers();


jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));

jest.mock('../../../bridge/Localization/localization.native', () => ({
    localized: (_, fallback) => fallback,
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
        const tree = renderer.create(
            <Signature />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    })

});
