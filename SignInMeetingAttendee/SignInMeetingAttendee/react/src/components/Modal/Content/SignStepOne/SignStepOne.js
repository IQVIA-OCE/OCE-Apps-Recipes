import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextInput } from 'apollo-react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
    updateFirstName, updateComments
} from '../../../../stores/meeting';
import { NAMESPACE } from '../../../../constants';
import { localized } from 'oce-apps-bridges';


const SignStepOne = () => {
    const { meetingDetails } = useSelector((state) => state.meeting);
    const dispatch = useDispatch();
    const onChangeName = val => {
        dispatch(updateFirstName(val))
    }
    const onChangeComment = val => {
        dispatch(updateComments(val))
    }
    return (
        <View style={styles.row}>
            <View style={styles.col}>
                <View style={styles.divider}>
                    <Text>{localized('Record_Type', 'Record Type')}</Text>
                    <Text style={styles.textDivider}>{meetingDetails[0]['RecordType.Name'] ? meetingDetails[0]['RecordType.Name'] : ''}</Text>
                </View>
                <View style={styles.divider}>
                    <Text>{localized('Meeting', 'Meeting')}<Text style={styles.mandatoryIcon}>*</Text></Text>
                    <Text style={styles.textDivider}>{meetingDetails[0].Name ? meetingDetails[0].Name : ''}</Text>
                </View>
                <View style={styles.divider}>
                    <TextInput
                        placeholder="Full Name"
                        label="Full Name"
                        required
                        style={styles.input}
                        onChangeText={onChangeName}
                    />
                </View>
            </View>
            <View style={styles.col}>
                <View style={styles.divider}>
                    <Text>{localized('Address', 'Address')}</Text>
                    <Text style={styles.textDivider}>{meetingDetails[0][`${NAMESPACE}Location__c`] ? meetingDetails[0][`${NAMESPACE}Location__c`] : ''}</Text>
                </View>
                <View style={styles.divider}>
                    <TextInput
                        label={localized('Global_Comments', 'Comments')}
                        multiline
                        rows={10}
                        minHeight={10}
                        style={styles.input}
                        onChangeText={onChangeComment}
                    />
                </View>
            </View>
        </View>
    )
};

export default SignStepOne;

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
    },
    mandatoryIcon: {
        color: 'red',
    },
    input: {
        width: '95%',
    },
    divider: {
        marginTop: 30,
    },
    textDivider: {
        marginTop: 5,
    },
    col: {
        flex: 0.5
    },
});
