

import React, { useState, useEffect } from 'react';
import { Search, Select, Title, secondaryBlue } from 'apollo-react-native';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { mapRecordTypes } from '../../utils/helper';
import { isIphone } from '../../constants';
import { localized } from '../../../bridge/Localization/localization.native';


const TableHeader = ({ onChangeRecordType, validateMeeting, selectedRecordType, onChangeSearch, showWriteInAttendeeModal }) => {
    const [recordTypes, setRecordTypes] = useState([]);
    const { meetingLayouts } = useSelector((state) => state.meeting);
    useEffect(() => {
        if (meetingLayouts.recordTypeInfos) {
            const filteredRecordTypes = mapRecordTypes(meetingLayouts.recordTypeInfos);
            setRecordTypes(filteredRecordTypes);
        }
    }, [meetingLayouts])
    return (
        <View style={styles.headerContainer} testID={'table-header'} >
            <View style={styles.recordTypeContainer}>
                <Title style={styles.label}>{localized('Record_Type', 'Record Type')}:</Title>
                <Select
                    options={recordTypes}
                    value={selectedRecordType}
                    onChange={val => onChangeRecordType(val)}
                    placeholder={localized('All', 'All')}
                    width={!isIphone ? 260 : '65%'}
                    testID={'select-record'}
                />
            </View>
            <View style={styles.searchInput}>
                <View>
                    <TouchableOpacity onPress={showWriteInAttendeeModal} disabled={validateMeeting}>
                        <Text style={[styles.notListedText, { color: validateMeeting ? '#000' : secondaryBlue[500] }]}>{localized('not_listed_question', 'Not Listed?')}</Text>
                    </TouchableOpacity>
                </View>
                <Search
                    placeholder={localized('Search', 'Search')}
                    style={{ width: !isIphone ? '90%' : '85%' }}
                    onChangeText={text => onChangeSearch(text)}
                    testID={'search'}
                />
            </View>

        </View>
    )
};

export default TableHeader;

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: !isIphone ? 'row' : 'column',
        justifyContent: 'space-between',
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    recordTypeContainer: {
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontWeight: 'bold',
        fontSize: 16,
        marginRight: 10
    },
    searchInput: {
        flexDirection: 'row',
        alignItems: 'center',
        maxWidth: 400,
        paddingRight: '5%',
        marginTop: !isIphone ? 0 : 20
    },
    notListedText: {
        textAlign: 'center',
        paddingVertical: 20,
        paddingRight: 20,
        fontSize: 16
    },
});