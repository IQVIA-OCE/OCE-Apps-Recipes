
import React from 'react';
import { useSelector } from 'react-redux';
import { Title, secondaryBlue, Paragraph, IconButton } from 'apollo-react-native';
import { View, StyleSheet } from 'react-native';
import { validateSignIn } from '../../utils/helper'
import { NAMESPACE } from '../../constants'

const CustomiPhoneCell = ({ row }) => {
    const { meetingGenConfig, meetingDetails } = useSelector((state) => state.meeting);
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
                    onPress={() => validateRestrictedFields(row, true)}
                    color={!isValidateSignIn ? '#000' : secondaryBlue[500]}
                    size={24}
                />
            </View>
        </View>
    );

}

export default CustomiPhoneCell;


const styles = StyleSheet.create({

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
