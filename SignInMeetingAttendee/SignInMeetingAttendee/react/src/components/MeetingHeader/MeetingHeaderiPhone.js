import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, NativeModules, Alert } from 'react-native';
import { Paragraph, secondaryBlue, IconButton } from 'apollo-react-native'
import { DateTime } from 'luxon';
import { useSelector } from 'react-redux';
import UserDetails from './UserDetails/UserDetails'
import { NAMESPACE } from '../../constants'
import { environment } from "../../../bridge/EnvironmentData/EnvironmentData.native"
import { localized } from '../../../bridge/Localization/localization.native';


const MeetingHeaderiPhone = ({ onSignInMeetingiPhone }) => {
    const [highlightPanel, sethighLightPanel] = useState([]);
    const { meetingDetails, meetingHighLightPanel } = useSelector((state) => state.meeting);
    useEffect(() => {
        if (meetingHighLightPanel[0]) {
            sethighLightPanel(meetingHighLightPanel[0].fieldItems);
        } else {
            NativeModules.ReachabilityBridge.networkReachabilityStatus().then(

                (networkStatusString) => {
                    if (networkStatusString === 'No Connection') {
                        const fieldItems = [{
                            label: localized('Name', 'Meeting Name'),
                            layoutComponents: [{
                                type: "Field",
                                value: "Name",
                                details: {
                                    name: "Name",
                                    type: "string"
                                }
                            }]
                        },
                        {
                            label: `${localized('Start', 'Start')}${localized('Date_time', 'Date/Time')}`,
                            layoutComponents: [{
                                type: `Field`,
                                value: `${NAMESPACE}StartDateTime__c`,
                                details: {
                                    name: `${NAMESPACE}StartDateTime__c`,
                                    type: "datetime"
                                }
                            }],
                        },
                        {
                            label: `${localized('InputDateRange_EndDate_DefaultLabel', 'End')}${localized('Date_time', 'Date/Time')}`,
                            layoutComponents: [{
                                type: "Field",
                                value: `${NAMESPACE}EndDateTime__c`,
                                details: {
                                    name: `${NAMESPACE}EndDateTime__c`,
                                    type: "datetime"
                                }
                            }],
                        },
                        {
                            label: `${localized('AttachmentCreatedByIdLabel', 'Created By')}`,
                            layoutComponents: [
                                {
                                    type: "Field",
                                    value: "CreatedById",
                                    details: {
                                        name: "CreatedBy",
                                        type: "reference",
                                        relationshipName: 'CreatedBy'
                                    }
                                },
                                {
                                    type: "Separator",
                                    value: ", ",
                                },
                                {
                                    type: "Field",
                                    value: "CreatedDate",
                                    details: {
                                        name: "CreatedDate",
                                        type: "datetime"
                                    }
                                },
                            ],
                        },
                        {
                            label: `${localized('Location', 'Location')}`,
                            layoutComponents: [{
                                type: "Field",
                                value: `${NAMESPACE}Location__c`,
                                details: {
                                    name: `${NAMESPACE}Location__c`,
                                    type: "string"
                                }
                            }],
                        }];
                        sethighLightPanel(fieldItems);
                    }
                }

            ).catch(
                // Log the rejection reason
                (reason) => {
                    Alert.alert(
                        "Something Went Wrong",
                        `Handle ReachabilityBridge Rejected promise - ${reason}`,
                        [
                            { text: "OK" }
                        ]
                    );
                }
            );
        }
    }, [meetingHighLightPanel]);

    const renderHighLightPanelValues = (comp) => {
        if (comp.length === 1) {
            if (comp[0].details.type === 'datetime') {
                return (meetingDetails[0] && meetingDetails[0][comp[0].value]) ? DateTime.fromISO(meetingDetails[0][comp[0].value], {
                    zone: environment.timeZone()
                }).toFormat('d/M/yy, hh:mm:a') : ''
            } else {
                return (meetingDetails[0] && meetingDetails[0][comp[0].value]) ? meetingDetails[0][comp[0].value] : ''
            }
        }
        if (comp.length > 1) {
            let value = '';
            comp.map((fields) => {
                if (fields.details && fields.details.type === 'reference') {
                    value = meetingDetails[0] && meetingDetails[0][`${fields.details.relationshipName}.Name`] ? `${meetingDetails[0][`${fields.details.relationshipName}.Name`]}` : ''
                }
                if (fields.type === 'Separator') {
                    value = `${value}${fields.value}`
                }
                if (fields.details && fields.details.type === 'datetime') {
                    value = `${value}${(meetingDetails[0] && meetingDetails[0][fields.value]) ? DateTime.fromISO(meetingDetails[0][fields.value], {
                        zone: environment.timeZone()
                    }).toFormat('d/M/yy, hh:mm:a') : ''} `;
                }
            })
            return value
        }
    }
    const renderHightLightPanel = () => {
        return highlightPanel && highlightPanel.map((field, index) => {
            const { layoutComponents } = field;
            return (
                <View style={styles.layoutContainer}>
                    <View style={styles.row}>
                        <Paragraph style={styles.infoText}>{field.label}</Paragraph>
                    </View>
                    <View style={styles.row}>
                        <Paragraph style={styles.labelText}>{renderHighLightPanelValues(layoutComponents)}</Paragraph>
                    </View>
                </View>
            )
        })
    }
    return (
        <View style={styles.headerContainer}>
            <UserDetails />
            <View style={styles.detailContiner}>
                <View>
                    <IconButton
                        icon="microphone"
                        disabled={true}
                        color={"#000"}
                        size={18}
                    />
                </View>
                <View style={{}}>
                    <View style={styles.layoutContainer}>
                        <Paragraph style={[styles.detailText]}>{localized("Global_Details", "Details")}</Paragraph>
                    </View>
                    <View>
                        {renderHightLightPanel()}
                    </View>
                </View >
            </View >
            <View style={styles.btnContainer}>
                <TouchableOpacity onPress={onSignInMeetingiPhone}>
                    <View style={styles.btn}><Paragraph style={styles.btnText}>{localized("Signature", "Sign")}</Paragraph></View>
                </TouchableOpacity>
            </View>
        </View >
    )
};

export default MeetingHeaderiPhone;

const styles = StyleSheet.create({
    headerContainer: {
        paddingHorizontal: 20,
        paddingVertical: 16,
    },

    detailContiner: {
        flexDirection: 'row',
        flex: 1,
        marginRight: 20
    },
    btnContainer: {
        alignContent: 'center',
        alignItems: 'center'
    },
    btn: {
        paddingHorizontal: 30,
        paddingVertical: 5,
        backgroundColor: secondaryBlue[400],
        borderRadius: 20
    },
    btnText: {
        color: 'white',
        fontWeight: 'bold'
    },
    layoutContainer: {
        marginTop: 10
    },
    row: {
        flexDirection: 'row',
    },
    detailText: {
        fontSize: 16,
        color: '#000',
        marginTop: 0,
        fontWeight: 'bold'
    },
    infoText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    labelText: {
        fontSize: 14,
        color: '#8D8D8D',
        marginTop: 0,
        marginRight: 10,
    }
});