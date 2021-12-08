import React, { useState, useEffect } from 'react';
import { Loader, Title, themeGrey, Modal, Banner } from 'apollo-react-native';
import { View, ScrollView, StyleSheet, NativeModules, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { locationManager } from '../../../bridge/Location/LocationManager.native';
import Header from '../../components/Header/Header'
import MeetingHeader from '../../components/MeetingHeader/MeetingHeader'
import MeetingHeaderiPhone from '../../components/MeetingHeader/MeetingHeaderiPhone'
import { NAMESPACE } from '../../constants';

import { externalNavigator } from "../../../bridge/Navigation/ExternalNavigator";
import { environment } from "../../../bridge/EnvironmentData/EnvironmentData.native"
import {
    fetchMeetingsInfoAsync,
    fetchLayoutsAsync,
    updateMeetingWithSignatureAsync,
    updateSignatureLocation,
    fetchOrganizationSettingsAsync,
    updateFirstName
} from '../../stores/meeting';
import Signature from '../../components/Signature/Signature';
import DataTable from '../../components/DataTable/DataTable';
import { isIphone } from '../../constants';
import ModalHeader from '../../components/Modal/Header/ModalHeader'
import ModalContent from '../../components/Modal/Content';

export var UserContext = React.createContext(null);

const MeetingAttendeeList = ({ parentId }) => {
    const [locationListner, setLocationListner] = useState(null);
    const [signatureLocationData, setSignatureLocationData] = useState({});
    const [showLoader, setShowLoader] = useState(true);
    const [showSignatureWindow, setSignatureWindow] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [isScrollEnabled, setIsScrollEnabled] = useState(true);
    const [isSign, setIsSign] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [validationObj, setValidationObj] = useState({});
    const [showBanner, setShowBanner] = useState(false);
    const { meetingDetails, error, isProcessing, signature, validationAlert } = useSelector((state) => state.meeting);
    const dispatch = useDispatch();
    const locationListener = (location) => {
        signatureLocationData[`${NAMESPACE}GeolocationOnSignature__Longitude__s`] = location.coordinate.longitude;
        signatureLocationData[`${NAMESPACE}GeolocationOnSignature__Latitude__s`] = location.coordinate.latitude;
        setSignatureLocationData(signatureLocationData);
    };
    useEffect(async () => {
        const { ReachabilityBridge } = NativeModules;
        try {
            const listener = await locationManager.addLocationListener(locationListener);
            setLocationListner(listener);
        } catch (error) {
        }
        locationManager.getLocationStatus().then((info) => {
            if (info.locationServicesEnabled) {
                if (info.authorizationStatus === 'authorizedWhenInUse' || info.authorizationStatus === 'authorizedAlways') {
                    ReachabilityBridge.networkReachabilityStatus()
                        .then(networkStatusString => {
                            if (networkStatusString === ' No Connection' || (!signatureLocationData[`${NAMESPACE}GeolocationOnSignature__Longitude__s`]
                                && !signatureLocationData[`${NAMESPACE}GeolocationOnSignature__Latitude__s`])) {
                                signatureLocationData[`${NAMESPACE}GeolocationMissingReasonOnSignature__c`] = 'Offline';
                                setSignatureLocationData(signatureLocationData);
                            }
                        })
                        .catch(reason => {
                        });
                } else if (info.authorizationStatus === 'denied' || info.authorizationStatus === 'restricted') {
                    signatureLocationData[`${NAMESPACE}GeolocationMissingReasonOnSignature__c`] = 'User Restricted';
                    setSignatureLocationData(signatureLocationData);
                }
            } else {
                signatureLocationData[`${NAMESPACE}GeolocationMissingReasonOnSignature__c`] = 'Device Restricted';
                setSignatureLocationData(signatureLocationData);
            }
        }).catch((reason) => {
            const msg = JSON.stringify(reason)
        })

        return async () => {
            try {
                await locationManager.removeLocationListener(locationListner)
                setLocationListner(null);
            } catch (error) {
            }
        }
    }, [])
    useEffect(() => {
        if (parentId && !showSignatureWindow) {
            dispatch(fetchOrganizationSettingsAsync());
            dispatch(fetchLayoutsAsync(`${NAMESPACE}MeetingMember__c`));
            dispatch(fetchMeetingsInfoAsync(parentId));
        };
    }, [parentId, showSignatureWindow]);

    useEffect(() => {
        if (validationAlert) {
            setValidationObj(validationAlert);
            setShowBanner(true);
        };
    }, [validationAlert]);


    useEffect(() => {
        if (meetingDetails[0]) {
            setShowLoader(false);
        }
        if (!isProcessing) {
            setShowLoader(false);
            setSignatureWindow(false);
            setIsSign(false);
        }
    }, [meetingDetails, isProcessing]);

    useEffect(() => {
        if (error) {
            Alert.alert(
                "Something Went Wrong",
                `${error.code} - ${error.message}`,
                [
                    { text: "OK", onPress: () => { setShowLoader(false); } }
                ]
            );
        }
    }, [error]);

    const onPrintAttendeeList = async () => {
        try {
            await externalNavigator.open(`${environment.sfInstanceURL()}/secur/frontdoor.jsp?sid={SessionId}&retURL=/apex/OCE__SignInSheet?Id=${parentId}`);
        } catch (error) {
        }
    }
    const onDoneSignAttende = () => {
        if (signature && signature.length > 131072) {
            Alert.alert(
                "Invalid Size",
                `Signture size is too large to save`,
                [
                    { text: "OK", onPress: () => { setShowLoader(false); } }
                ]
            );
            return;
        }
        setShowLoader(true);
        dispatch(updateSignatureLocation(signatureLocationData))
        dispatch(updateMeetingWithSignatureAsync(currentUserId))
    }
    const onSignInAttendee = (rowValue) => {
        setSignatureWindow(true);
        setCurrentUserId(rowValue);
        if (typeof rowValue === 'object') {
            setCurrentUserId(null);
        } else {

        }
        if (isIphone && !isModalVisible) {
            setIsSign(true);
        }
        dismissModal();
    }

    const handleBegin = () => {
        setIsScrollEnabled(false);
    }
    const handleEnd = () => {
        setIsScrollEnabled(true);
    };
    const onSignInMeetingiPhone = () => {
        setIsSign(false);
    }
    const dismissModal = () => {
        setIsModalVisible(false)
        // setIsSign(false)
    }
    const showWriteInAttendeeModal = () => {
        setIsModalVisible(true)
    }
    const onCancel = () => {
        setSignatureWindow(false);
        setIsSign(false)
        setIsModalVisible(false)
        dispatch(updateFirstName(null))
        setCurrentUserId(null);

    }
    return (
        <UserContext.Provider value={currentUserId}>
            <View style={styles.flex100}>
                <View style={styles.flex100}>
                    {showLoader && <View style={styles.loader}>
                        <Loader />
                    </View>
                    }
                    <View style={styles.flex100}>
                        <Header onCancel={onCancel} onDoneSignAttende={onDoneSignAttende} onPrintAttendeeList={onPrintAttendeeList} showSignatureWindow={showSignatureWindow} />
                        <View style={styles.mainContainer}>
                            <Banner
                                closeIcon
                                visible={showBanner}
                                variant={validationObj.alertType === 'warn' ? 'warning' : 'error'}
                                onCloseIconPress={() => setShowBanner(false)}
                                style={styles.banner}
                            >
                                {validationObj.reason}
                            </Banner>
                            {!isIphone && <View>
                                <View style={styles.row}>
                                    <Title style={styles.meetingName}>{meetingDetails[0] ? meetingDetails[0].Name : ''}</Title>
                                </View>
                                <MeetingHeader />
                            </View>
                            }
                            <ScrollView scrollEnabled={isScrollEnabled}>
                                <View>
                                    {(isIphone && isSign && showSignatureWindow) && <MeetingHeaderiPhone onSignInMeetingiPhone={onSignInMeetingiPhone} />}
                                    {(!isSign && showSignatureWindow) && <Signature handleBegin={handleBegin} handleEnd={handleEnd} isSign={isSign} onDoneSignAttende={onDoneSignAttende} />}
                                    {!showSignatureWindow && <DataTable onSignInAttendee={onSignInAttendee} currentUserId={currentUserId} showWriteInAttendeeModal={showWriteInAttendeeModal} />}
                                </View>
                            </ScrollView >
                        </View>
                        <Modal
                            visible={isModalVisible}
                            contentContainerStyle={styles.modalContainer}
                        >
                            <ModalHeader dismissModal={dismissModal} onSignAttendee={onSignInAttendee} />

                            <ModalContent />

                        </Modal>
                    </View>
                </View>
            </View>
        </UserContext.Provider >
    )
};
export default MeetingAttendeeList;


const styles = StyleSheet.create({

    flex100: {
        flex: 1
    },
    mainContainer: {
        backgroundColor: themeGrey[50],
        flex: 1
    },
    loader: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        zIndex: 9999
    },
    meetingName: {
        textAlign: 'center',
        paddingTop: 10,
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalContainer: {
        paddingHorizontal: 20,
        flex: 1
    },

});
