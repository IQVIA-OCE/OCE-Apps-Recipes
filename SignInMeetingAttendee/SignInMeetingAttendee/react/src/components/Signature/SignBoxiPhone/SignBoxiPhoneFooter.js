import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { Paragraph, secondaryBlue, themeGrey } from '@oce-apps/apollo-react-native';
import { updateMeal, updateMealOption } from '../../../stores/meeting'
import { localized } from '@oce-apps/oce-apps-bridges';


const SignBoxiPhoneFooter = ({ handleClear, onDoneSignAttende }) => {
    const { isProcessing, signature } = useSelector((state) => state.meeting);
    return (
        <View style={styles.signFooterContainer} testID={'SignBoxiPhoneFooter'}>
            <TouchableOpacity onPress={onDoneSignAttende} disabled={isProcessing || !signature}>
                <View style={styles.doneBtn}>
                    <Paragraph style={styles.doneBtnText}>{localized('Done', 'Done')}</Paragraph>
                </View>
            </TouchableOpacity>
            <View style={styles.signFooter}>
                <TouchableOpacity onPress={handleClear} disabled={isProcessing || !signature}><Paragraph style={styles.clearSignatureText}>{localized('Global_Clear', 'Clear')}</Paragraph></TouchableOpacity>
            </View>
        </View >
    )
};


export default SignBoxiPhoneFooter;

const styles = StyleSheet.create({
    signFooterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    doneBtn: {
        paddingHorizontal: 30,
        paddingVertical: 5,
        backgroundColor: secondaryBlue[400],
        borderRadius: 20
    },
    doneBtnText: {
        color: 'white', fontWeight: 'bold'
    },

    signFooter: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        paddingRight: 20,
        flex: 0.5,
    },
    meetingOwnerText: {
        fontSize: 14
    },
    clearSignatureText: {
        color: secondaryBlue[500],
        fontSize: 14
    },
});
