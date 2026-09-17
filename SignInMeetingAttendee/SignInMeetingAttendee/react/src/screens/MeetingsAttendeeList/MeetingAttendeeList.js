import React, { useState, useEffect } from 'react';
import { Loader, Title, themeGrey, Modal, Banner, useTheme, ApolloProgress } from '@oce-apps/apollo-react-native';
import { View, ScrollView, StyleSheet, NativeModules, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import color from 'color'
import { locationManager, externalNavigator, environment } from '@oce-apps/oce-apps-bridges';
import { setIsProcessing } from '../../stores/meeting'
import Header from '../../components/Header/Header'
import MeetingHeader from '../../components/MeetingHeader/MeetingHeader'
import MeetingHeaderiPhone from '../../components/MeetingHeader/MeetingHeaderiPhone'
import { NAMESPACE } from '../../constants';

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
    const theme = useTheme();
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
    const { meetingDetails, error, isProcessing, signature, validationAlert, firstName } = useSelector((state) => state.meeting);
    const dispatch = useDispatch();
    const locationListener = (location) => {
        signatureLocationData[`${NAMESPACE}GeolocationOnSignature__Longitude__s`] = location.coordinate.longitude;
        signatureLocationData[`${NAMESPACE}GeolocationOnSignature__Latitude__s`] = location.coordinate.latitude;
        setSignatureLocationData(signatureLocationData);
    };
    const bootStrap = async () => {

        const { ReachabilityBridge } = NativeModules;
        try {
            const listener = await locationManager.addLocationListener(locationListener);
            setLocationListner(listener);
        } catch (error) {
            Alert.alert(
                "Something Went Wrong",
                `${error.code} - ${error.message}`,
                [
                    { text: "OK", onPress: () => { } }
                ]
            );
        }
        try {
            const locationIfo = await locationManager.getLocationStatus();
            if (locationIfo.locationServicesEnabled) {
                if (locationIfo.authorizationStatus === 'authorizedWhenInUse' || locationIfo.authorizationStatus === 'authorizedAlways') {
                    const networkStatusString = await ReachabilityBridge.networkReachabilityStatus();
                    if (networkStatusString === 'No Connection' || (!signatureLocationData[`${NAMESPACE}GeolocationOnSignature__Longitude__s`]
                        && !signatureLocationData[`${NAMESPACE}GeolocationOnSignature__Latitude__s`])) {
                        signatureLocationData[`${NAMESPACE}GeolocationMissingReasonOnSignature__c`] = 'Offline';
                        setSignatureLocationData(signatureLocationData);
                    }
                } else if (locationIfo.authorizationStatus === 'denied' || locationIfo.authorizationStatus === 'restricted') {
                    signatureLocationData[`${NAMESPACE}GeolocationMissingReasonOnSignature__c`] = 'User Restricted';
                    setSignatureLocationData(signatureLocationData);
                }
            } else {
                signatureLocationData[`${NAMESPACE}GeolocationMissingReasonOnSignature__c`] = 'Device Restricted';
                setSignatureLocationData(signatureLocationData);
            }
        } catch (error) {
            Alert.alert(
                "Error in fetching location",
                `${error.code} - ${error.message}`,
                [
                    { text: "OK", onPress: () => { } }
                ]
            );
        }
        return () => {
            try {
                locationManager.removeLocationListener(locationListner)
                setLocationListner(null);
            } catch (error) {
                Alert.alert(
                    "Error in removing location listener",
                    `${error.code} - ${error.message}`,
                    [
                        { text: "OK", onPress: () => { } }
                    ]
                );
            }
        }

    }


    useEffect(() => {
        bootStrap();
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
        if (meetingDetails[0] && !isProcessing) {
            setShowLoader(false);
        }
        if (!isProcessing && !currentUserId && !firstName) {
            setShowLoader(false);
            setSignatureWindow(false);
            setIsSign(false);
        }
        setShowLoader(isProcessing);
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
            await externalNavigator.open(`${environment.sfInstanceURL()}/secur/frontdoor.jsp?sid={SessionId}&retURL=/apex/${NAMESPACE}SignInSheet?Id=${parentId}`);
        } catch (error) {
            Alert.alert(
                "Something Went Wrong",
                `${error.code} - ${error.message}`,
                [
                    { text: "OK", onPress: () => { } }
                ]
            );
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
        setCurrentUserId(null);
    }
    const onSignInAttendee = (rowValue) => {
        if (!isIphone || (isIphone && isModalVisible)) {
            dispatch(setIsProcessing(true));
        }
        setSignatureWindow(true);
        setCurrentUserId(rowValue);
        if (typeof rowValue === 'object') {
            setCurrentUserId(null);
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
        dispatch(setIsProcessing(true));
        setIsSign(false);
    }
    const dismissModal = () => {
        setIsModalVisible(false)
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
            <View style={[styles.flex100, { backgroundColor: theme.colors.background }]}>
                <View style={styles.flex100} testID="loader-wrap">
                    <View style={styles.flex100}>
                        <Header onCancel={onCancel} onDoneSignAttende={onDoneSignAttende} onPrintAttendeeList={onPrintAttendeeList} showSignatureWindow={showSignatureWindow} />
                        <View style={[styles.mainContainer, { backgroundColor: theme.dark ? theme.colors.background : themeGrey[50] }]}>
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
                {(showLoader && parentId) && <View style={[styles.loader, {
                    backgroundColor: theme.dark
                        ? color(theme.colors.placeholder).darken(0.7).hex()
                        : color(theme.colors.surface).lighten(1).hex()
                }]}>
                    <ApolloProgress />
                </View>
                }
            </View>
        </UserContext.Provider >
    )
};
export default MeetingAttendeeList;


const styles = StyleSheet.create({

    flex100: {
        flex: 1,
    },
    mainContainer: {
        flex: 1
    },
    loader: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10
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
