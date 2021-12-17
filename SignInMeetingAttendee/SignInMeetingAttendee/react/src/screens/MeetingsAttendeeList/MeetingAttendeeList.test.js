import React from 'react';
import MeetingAttendeeList from './MeetingAttendeeList';
import renderer, { act } from 'react-test-renderer';
import { useSelector, useDispatch } from 'react-redux';
import { records, meetingLevelConfigRecord, meetingMemberLayout, meetingHighLightPanel } from "../../constants/mockData";
import { locationManager } from '../../../bridge/Location/LocationManager.native';
import { NAMESPACE } from '../../constants';
import { NativeModules } from 'react-native';
import Header from '../../components/Header/Header'
import DataTable from '../../components/DataTable/DataTable';
// import Signature from '../../components/Signature/Signature';
import { externalNavigator } from '../../../bridge/Navigation/ExternalNavigator';
// import * as commonConstants from '../../constants';


jest.useFakeTimers();


jest.mock('../../../bridge/Navigation/ExternalNavigator');

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));



jest.mock('../../../bridge/Location/LocationManager.native', async () =>
({
    locationManager: {
        addLocationListener: jest.fn(),
        removeLocationListener: jest.fn(),
        getLocationStatus: jest.fn().mockResolvedValueOnce(
            {
                locationServicesEnabled: true,
                authorizationStatus: 'authorizedWhenInUse'
            }
        ).mockRejectedValue('ERROR')
    }
}));
jest.mock("../../../bridge/Localization/localization.native");

NativeModules.ReachabilityBridge = {
    networkReachabilityStatus: jest.fn()
        .mockResolvedValueOnce('ONLINE')
        .mockRejectedValue('ERROR')
}


describe('MeetingListAttendees Widget', () => {
    beforeEach(() => {
        externalNavigator.open.mockImplementation(arg => {
            redirectURL = arg;
        });
    });

    it('Meeting List attendeess should render properly', async () => {
        // commonConstants.isIphone = false;
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            meeting: {
                meetingDetails: records,
                meetingLayouts: meetingMemberLayout,
                meetingConfig: meetingLevelConfigRecord,
                error: {
                    code: 'ERR',
                    message: 'INVALID'
                },
                signature: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABLgAAAI",
                meetingHighLightPanel: meetingHighLightPanel
            }
        }));
        const tree = renderer.create(
            <MeetingAttendeeList />
        );
        jest.advanceTimersByTime(500);
        await act(async () => {
            const headerComponent = tree.root.findByType(Header);
            headerComponent.props.onDoneSignAttende();
            headerComponent.props.onCancel();
            headerComponent.props.onPrintAttendeeList();
            const dataTableComp = tree.root.findByType(DataTable);
            dataTableComp.props.onSignInAttendee('a3223423343');
            // const signatureComponent = tree.root.findByType(Signature);
            // signatureComponent.props.handleBegin();
            // signatureComponent.props.handleEnd();
            dataTableComp.props.onSignInAttendee({ userId: 'a3223423343' });
            jest.advanceTimersByTime(500);

        });
        // await act(async () => {
        //     const onChangeState = jest.spyOn(React, "useState");
        //     onChangeState.mockImplementation(size => [size, changeSize]);
        //     const signatureComponent = tree.root.findByType(Signature);
        //     signatureComponent.props.handleBegin();
        //     signatureComponent.props.handleEnd();
        //     jest.advanceTimersByTime(500);

        // });




        expect(tree).toMatchSnapshot();
    })

});
