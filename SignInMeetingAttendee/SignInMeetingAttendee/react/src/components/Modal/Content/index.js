import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import SignStepOne from './SignStepOne/SignStepOne';

const ModalContent = () => (
    <ScrollView>
        <SignStepOne />
    </ScrollView >
);

export default ModalContent;

const styles = StyleSheet.create({
    meetingInfoContainer: {
        marginVertical: 20
    },
    textCenter: {
        textAlign: 'center'
    },

    loader: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        zIndex: 9999
    }
});