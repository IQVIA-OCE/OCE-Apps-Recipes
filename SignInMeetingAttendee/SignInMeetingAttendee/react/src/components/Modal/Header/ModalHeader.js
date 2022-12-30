import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { themeGrey, Title } from 'apollo-react-native';
import { useSelector } from 'react-redux';
import { localized } from 'oce-apps-bridges';


const ModalHeader = ({ dismissModal, onSignAttendee }) => {
    const { firstName } = useSelector((state) => state.meeting);
    const [isFormValid, setFormValid] = useState(true);
    useEffect(() => {
        if (firstName) setFormValid(false);
    }, [firstName]);
    return (
        <View style={styles.modalHeader}>
            <TouchableOpacity onPress={dismissModal}><Title style={styles.headerText}>{localized('Global_Cancel', 'Cancel')}</Title></TouchableOpacity>
            <Title style={styles.headerText}>{localized('meeting_new_write_in', 'New Write-In')}</Title>
            <TouchableOpacity onPress={onSignAttendee} disabled={isFormValid}>
                <View style={styles.headerActionBtn}>
                    <Title style={styles.headerText} testID={'Sign'}>{localized('Signature', 'Sign')}</Title>
                </View>
            </TouchableOpacity>
        </View >
    )
};

export default ModalHeader;

const styles = StyleSheet.create({
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: themeGrey[400],
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignItems: 'center'
    },
    headerText: {
        fontSize: 16
    },
    headerActionBtn: {
        paddingHorizontal: 10,
        backgroundColor: themeGrey[400],
    },

});
