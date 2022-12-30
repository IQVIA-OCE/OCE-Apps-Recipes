import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, NativeModules, Alert } from 'react-native';
import { environment, localized } from "oce-apps-bridges"
import { Paragraph } from 'apollo-react-native'
import { DateTime } from 'luxon';
import { useSelector } from 'react-redux';
import { NAMESPACE } from '../../constants'


const MeetingHeader = () => {
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
        return highlightPanel && highlightPanel.filter((filelds) => filelds.layoutComponents[0].value !== 'Name').map((field, index) => {
            const { layoutComponents } = field;
            return (
                <View style={styles.layoutContainer}>
                    <View style={index === highlightPanel.length - 2 ? styles.row : styles.meetingInfo}>
                        <Paragraph style={[styles.textCenter, styles.infoText]}>

                            {
                                renderHighLightPanelValues(layoutComponents)
                            }

                        </Paragraph>
                    </View>
                    <View style={styles.row}>
                        <Paragraph style={[styles.textCenter, styles.labelText]}>{field.label}</Paragraph>
                    </View>
                </View>
            )
        })
    }
    return (
        <View style={styles.headerContainer}>
            {renderHightLightPanel()}
        </View>
    )
};

export default MeetingHeader;

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        paddingHorizontal: 50,
        paddingVertical: 20,
    },

    layoutContainer: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
    },
    textCenter: {
        flex: 1,
        textAlign: 'center'
    },
    meetingInfo: {
        flexDirection: 'row',
        borderRightWidth: 2,
    },
    infoText: {
        fontWeight: 'bold',
        fontSize: 16,
        paddingHorizontal: 2
    },
    labelText: {
        fontSize: 14,
        color: '#8D8D8D',
        marginTop: 5
    }
});
