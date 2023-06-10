import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { NAMESPACE } from '../../constants'
import { useSelector } from 'react-redux';
import { Table, useTheme } from 'apollo-react-native';
import { View, StyleSheet, NativeModules, Alert } from 'react-native';
import TableHeader from '../TableHeader/TableHeader'
import { isIphone } from '../../constants';
import { localized } from 'oce-apps-bridges';
import { sortStrings, sortSignIn, alertValidationType, validateRestrictedProducts, onValidateWriteIn } from '../../utils/helper'
import ActionCell from './ActionCell';
import CustomCell from './CustomCell';
import CustomColumnHeader from './CustomColumnHeader';
import CustomiPhoneCell from './CustomiPhoneCell';
import { setRestrictedProductsValidationAlert } from '../../stores/meeting'

const DataTable = ({ onSignInAttendee, currentUserId, showWriteInAttendeeModal }) => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const [meetingMembers, setMeetingMembersInfo] = useState([]);
    const [filteredMeetingMembers, setFilteredMeetingMembersInfo] = useState([])
    const [selectedRecordType, setRecordType] = useState(null);
    const [isWriteInEnabled, setIsWriteInEnabled] = useState(true);
    const [columns, setColumns] = useState([]);
    const { meetingDetails, meetingGenConfig, meetingLayouts, meetingProductTopics } = useSelector((state) => state.meeting);

    useEffect(() => {
        NativeModules.ReachabilityBridge.networkReachabilityStatus().then(
            (networkStatusString) => {
                if (networkStatusString === 'No Connection') {
                    let tableColumns = [
                        {
                            header: CustomColumnHeader(localized('Name', 'Name')),
                            accessor: 'Name',
                            sortFunction: sortStrings,
                            customCell: props => <CustomCell {...props} />
                        },
                        {
                            header: CustomColumnHeader(localized('Address', 'Address')),
                            accessor: `${NAMESPACE}AddressText__c`,
                            sortFunction: sortStrings,
                            customCell: props => <CustomCell {...props} />
                        },
                        {
                            header: CustomColumnHeader(localized('Specialty', 'Specialty')),
                            accessor: `${NAMESPACE}SpecialtyText__c`,
                            sortFunction: sortStrings,
                            customCell: props => <CustomCell {...props} />
                        },
                        {
                            header: CustomColumnHeader(localized('MealOption', 'Meal Option')),
                            accessor: `${NAMESPACE}MealOption__c`,
                            sortFunction: sortStrings,
                            customCell: props => <CustomCell {...props} />
                        },
                        {
                            header: CustomColumnHeader(localized('Sign_In', 'Sign In')),
                            accessor: `${NAMESPACE}SignatureDate__c`,
                            sortFunction: sortSignIn,
                            customCell: props => <ActionCell {...props} />,

                        },
                    ];
                    if (isIphone) {
                        tableColumns = [
                            {
                                header: CustomColumnHeader(localized('Name', 'Name')),
                                accessor: 'Name',
                                sortFunction: sortStrings,
                                customCell: props => <CustomiPhoneCell {...props} />
                            },
                        ];
                    }
                    setColumns(tableColumns);
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

    }, [])

    useEffect(() => {
        if (meetingDetails && meetingDetails[0]) {
            const recordsArr = meetingDetails[0][`${NAMESPACE}MeetingMember__r`] ? meetingDetails[0][`${NAMESPACE}MeetingMember__r`].records : [];
            setMeetingMembersInfo(recordsArr);
            setFilteredMeetingMembersInfo(recordsArr);
        }
    }, [meetingDetails]);

    useEffect(() => {
        const shouldEnableWriteIn = onValidateWriteIn();
        setIsWriteInEnabled(shouldEnableWriteIn);
    }, [meetingDetails]);



    useEffect(() => {
        if (meetingLayouts.fields) {
            if (isIphone) {
                const tableColumns = meetingLayouts.fields.filter((field) => field.name === `Name`).map((fieldVal) => ({
                    header: CustomColumnHeader(fieldVal.label),
                    accessor: fieldVal.name,
                    sortFunction: sortStrings,
                    customCell: props => <CustomiPhoneCell {...props} />
                }))
                setColumns(tableColumns);
            } else {
                const tableColumns = meetingLayouts.fields.filter((field) => field.name === `Name` || field.name === `${NAMESPACE}AddressText__c`
                    || field.name === `${NAMESPACE}SpecialtyText__c` || field.name === `${NAMESPACE}MealOption__c` || field.name === `${NAMESPACE}SignatureDate__c`).map((fieldVal) => {
                        if (fieldVal.name === `${NAMESPACE}SignatureDate__c`) {
                            return {
                                header: CustomColumnHeader(localized('Sign_In', 'Sign In')),
                                accessor: fieldVal.name,
                                sortFunction: sortSignIn,
                                customCell: props => <ActionCell {...props} />
                            }
                        }
                        return {
                            header: CustomColumnHeader(fieldVal.label),
                            accessor: fieldVal.name,
                            sortFunction: sortStrings,
                            customCell: props => <CustomCell  {...props} />
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
        let alertType = null;
        if (meetingGenConfig[0] && meetingGenConfig[0][`${NAMESPACE}ValidateRestrictedProductsForWalkIns__c`]) {
            alertType = alertValidationType(isWalkIn);
            const restrictedProducts = validateRestrictedProducts(meetingDetails[0], row, meetingProductTopics);
            if (restrictedProducts && restrictedProducts.length > 0) {
                const descrepancyReason = row.discrepancyReasons[0] ? row.discrepancyReasons[0].label : `This meeting includes topic products that are not eligible for ${row.Name}`
                dispatch(setRestrictedProductsValidationAlert({
                    reason: descrepancyReason,
                    alertType,
                }));
            }
        }

        if (alertType !== 'block') {
            onSignInAttendee(row.Id)
        }

    }

    return (
        <View style={[styles.tableContainer, { backgroundColor: theme.colors.background }]} testID={'meeting-member-list'}>
            <TableHeader onChangeRecordType={onChangeRecordType}
                isWriteInEnabled={isWriteInEnabled}
                selectedRecordType={selectedRecordType}
                onChangeSearch={onChangeSearch}
                showWriteInAttendeeModal={showWriteInAttendeeModal}
                testID={'TableHeader'}
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
