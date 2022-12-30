
import React from 'react';
import { useSelector } from 'react-redux';
import { secondaryBlue, Paragraph } from 'apollo-react-native';
import { View, TouchableOpacity } from 'react-native';
import { validateSignIn } from '../../utils/helper'
import { localized } from 'oce-apps-bridges';

const ActionCell = ({ row }) => {
    const { meetingDetails, meetingGenConfig } = useSelector((state) => state.meeting);
    const { validateRestrictedFields } = row;
    const isValidateSignIn = validateSignIn(meetingGenConfig, meetingDetails, row);
    return (
        <View style={{ flexDirection: 'row' }} key={row.Id}>
            <TouchableOpacity onPress={() => validateRestrictedFields(row, true)} disabled={!isValidateSignIn} testID={'ActionCell'}>
                <View><Paragraph style={{ color: (!isValidateSignIn) ? '#000' : secondaryBlue[500] }}>Sign In</Paragraph></View>
            </TouchableOpacity>
        </View>
    );
};

export default ActionCell;
