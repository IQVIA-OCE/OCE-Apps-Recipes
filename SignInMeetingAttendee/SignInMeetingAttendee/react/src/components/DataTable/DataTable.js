import React, { useState, useEffect } from 'react';
import { NAMESPACE } from '../../constants'
import { useSelector } from 'react-redux';
import { Table, Title, secondaryBlue, Paragraph, IconButton } from 'apollo-react-native';
import { View, TouchableOpacity, StyleSheet, NativeModules, Alert } from 'react-native';
import TableHeader from '../TableHeader/TableHeader'
import { isIphone } from '../../constants';
import { validateSignIn } from '../../utils/helper'
import { localized } from '../../../bridge/Localization/localization.native';

const DataTable = ({ onSignInAttendee, currentUserId, showWriteInAttendeeModal }) => {
    const [meetingMembers, setMeetingMembersInfo] = useState([]);
    const [filteredMeetingMembers, setFilteredMeetingMembersInfo] = useState([])
    const [selectedRecordType, setRecordType] = useState(null);
    const [validateMeeting, setValidateMeeting] = useState(true);
    const [columns, setColumns] = useState([]);
    const { meetingDetails, meetingGenConfig, meetingLayouts, meetingProductTopics, meetingConfig } = useSelector((state) => state.meeting);

    useEffect(() => {

        NativeModules.ReachabilityBridge.networkReachabilityStatus().then(

            (networkStatusString) => {
                if (networkStatusString === 'No Connection') {
                    let tableColumns = [
                        {
                            header: customColumnHeader(localized('Name', 'Name')),
                            accessor: 'Name',
                            sortFunction: sortStrings,
                            customCell: customCell
                        },
                        {
                            header: customColumnHeader(localized('Address', 'Address')),
                            accessor: `${NAMESPACE}AddressText__c`,
                            sortFunction: sortStrings,
                            customCell: customCell
                        },
                        {
                            header: customColumnHeader(localized('Specialty', 'Specialty')),
                            accessor: `${NAMESPACE}SpecialtyText__c`,
                            sortFunction: sortStrings,
                            customCell: customCell
                        },
                        {
                            header: customColumnHeader(localized('MealOption', 'Meal Option')),
                            accessor: `${NAMESPACE}MealOption__c`,
                            sortFunction: sortStrings,
                            customCell: customCell
                        },
                        {
                            header: customColumnHeader(localized('Sign_In', 'Sign In')),
                            accessor: `${NAMESPACE}SignatureDate__c`,
                            sortFunction: sortSignIn,
                            customCell: ActionCell,

                        },
                    ];
                    if (isIphone) {
                        tableColumns = [
                            {
                                header: customColumnHeader(localized('Name', 'Name')),
                                accessor: 'Name',
                                sortFunction: sortStrings,
                                customCell: customiPhoneCell
                            },
                        ];
                    }
                    setColumns(tableColumns);
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

    }, [])

    useEffect(() => {
        if (meetingDetails && meetingDetails[0]) {
            const recordsArr = meetingDetails[0][`${NAMESPACE}MeetingMember__r`] ? meetingDetails[0][`${NAMESPACE}MeetingMember__r`].records : [];
            setMeetingMembersInfo(recordsArr);
            setFilteredMeetingMembersInfo(recordsArr);
        }
    }, [meetingDetails]);

    useEffect(() => {
        if (meetingGenConfig && meetingGenConfig[0]) {
            const checkValidDate = !meetingDetails[0] || !meetingGenConfig[0][`${NAMESPACE}EnableWriteIns__c`];
            setValidateMeeting(checkValidDate);
        }
    }, [meetingGenConfig, meetingDetails]);



    useEffect(() => {
        if (meetingLayouts.fields) {
            if (isIphone) {
                const tableColumns = meetingLayouts.fields.filter((field) => field.name === `Name`).map((fieldVal) => ({
                    header: customColumnHeader(fieldVal.label),
                    accessor: fieldVal.name,
                    sortFunction: sortStrings,
                    customCell: customiPhoneCell
                }))
                setColumns(tableColumns);
            } else {
                const tableColumns = meetingLayouts.fields.filter((field) => field.name === `Name` || field.name === `${NAMESPACE}AddressText__c`
                    || field.name === `${NAMESPACE}SpecialtyText__c` || field.name === `${NAMESPACE}MealOption__c` || field.name === `${NAMESPACE}SignatureDate__c`).map((fieldVal) => {
                        if (fieldVal.name === `${NAMESPACE}SignatureDate__c`) {
                            return {
                                header: customColumnHeader(localized('Sign_In', 'Sign In')),
                                accessor: fieldVal.name,
                                sortFunction: sortSignIn,
                                customCell: ActionCell
                            }
                        }
                        return {
                            header: customColumnHeader(fieldVal.label),
                            accessor: fieldVal.name,
                            sortFunction: sortStrings,
                            customCell: customCell
                        }
                    });
                const signInIndex = tableColumns.findIndex((column) => column.accessor === `${NAMESPACE}SignatureDate__c`);
                const signInColumn = tableColumns[signInIndex];
                tableColumns.splice(signInIndex, 1);
                tableColumns.push(signInColumn);
                setColumns(tableColumns);
            }
        }

    }, [meetingLayouts])

    const onChangeRecordType = (val) => {
        setRecordType(val);
        const filteredMembers = meetingMembers.filter((mem) => val ? mem.RecordTypeId === val.id : mem.RecordTypeId);
        setFilteredMeetingMembersInfo(filteredMembers);

    }
    const onChangeSearch = (val) => {
        const filteredMembers = meetingMembers.filter(mem =>
            Object.keys(mem).some(str => (mem[str] && typeof mem[str] === 'string') && mem[str].toLowerCase().includes(val.toLowerCase())));
        setFilteredMeetingMembersInfo(filteredMembers);
    }

    const validateRestrictedFields = (row, isWalkIn) => {
        onSignInAttendee(row.Id);
    }

    const ActionCell = ({ row }) => {
        const { validateRestrictedFields } = row;
        try {
            const isValidateSignIn = validateSignIn(meetingGenConfig, meetingDetails, row)
            return (
                <View style={{ flexDirection: 'row' }} key={row.Id}>
                    <TouchableOpacity onPress={() => validateRestrictedFields(row, true)} disabled={!isValidateSignIn}>
                        <View><Paragraph style={{ color: (!isValidateSignIn) ? '#000' : secondaryBlue[500] }}>Sign In</Paragraph></View>
                    </TouchableOpacity>
                </View>
            );
        } catch (err) {
            return null;
        }
    };


    const sortStrings = (accessor, sortOrder, a, b) => {
        var va = (a[accessor] === null) ? "" : "" + a[accessor],
            vb = (b[accessor] === null) ? "" : "" + b[accessor];
        if (sortOrder === 'ascending') {
            return (va > vb) ? 1 : ((vb > va) ? -1 : 0)
        } else {
            return (va < vb) ? 1 : ((vb < va) ? -1 : 0)
        }
    };

    const sortSignIn = (accessor, sortOrder, a, b) => {
        if (sortOrder === 'ascending') {
            return new Date(a[accessor]) - new Date(b[accessor])
        } else {
            return new Date(b[accessor]) - new Date(a[accessor])
        }
    };

    const customCell = ({ row, column }) => {
        let mealOption = row[column.accessor];
        if (column.accessor === `${NAMESPACE}MealOption__c`) {
            mealOption = meetingConfig[0] && meetingConfig[0][`${NAMESPACE}MealFieldType__c`] === 'Picklist' ? row[column.accessor] : (row[`${NAMESPACE}Meal__c`] ? localized('yes', 'Yes') : localized('no', 'No'))
        }
        return (
            <View key={row.Id}>
                <Paragraph>{mealOption}</Paragraph>
            </View>
        );
    };

    const customiPhoneCell = ({ row, column }) => {
        try {
            const { validateRestrictedFields } = row;
            const isValidateSignIn = validateSignIn(meetingGenConfig, meetingDetails, row)
            return (
                <View style={styles.iPhoneCellContainer} key={row.Id}>
                    <View>
                        <Title style={styles.iPhoneCellNameText}>{row.Name}</Title>
                        <Paragraph style={styles.iPhoneCellSpecialityText}>{row[`${NAMESPACE}SpecialtyText__c`]}</Paragraph>
                    </View>
                    <View>
                        <IconButton
                            icon="pencil"
                            disabled={!isValidateSignIn}
                            onPress={() => validateRestrictedFields(row)}
                            color={!isValidateSignIn ? '#000' : secondaryBlue[500]}
                            size={24}
                        />
                    </View>
                </View>
            );
        } catch (err) {
            return null;
        }

    }

    const customColumnHeader = (title) => <View style={styles.columnHeaderContainer}><Title style={styles.columnHeader}>{title}</Title></View>


    return (
        <View style={styles.tableContainer} testID={'meeting-member-list'}>
            <TableHeader onChangeRecordType={onChangeRecordType}
                validateMeeting={validateMeeting}
                selectedRecordType={selectedRecordType}
                onChangeSearch={onChangeSearch}
                showWriteInAttendeeModal={showWriteInAttendeeModal}
            />
            <Table
                columns={columns}
                rows={filteredMeetingMembers && filteredMeetingMembers.map((row) => ({
                    ...row,
                    validateRestrictedFields,
                    key: row.Id,
                }))}
                initialSortedColumn="Name"
                initialSortOrder="ascending"
                rowsPerPageOptions={[10, 20, 30]}
                columnWidth={!isIphone ? [300, 200, 200, 200, 200] : [345]}
                showFilterIcon={true}
                inlinePagination
                hidePagination
            />
        </View>
    )
};
export default DataTable;


const styles = StyleSheet.create({

    tableContainer: {
        marginHorizontal: !isIphone ? 20 : 0,
        borderRadius: 10,
        backgroundColor: '#fff',
        paddingTop: 20
    },
    columnHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 0,
        paddingBottom: 30

    },
    iPhoneCellContainer: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
        alignContent: 'center',
        paddingVertical: 10
    },
    iPhoneCellNameText: {
        fontSize: 16
    },
    iPhoneCellSpecialityText: {
        fontSize: 14
    }

});
