import React from 'react';
import { View, StyleSheet } from 'react-native';
import SignBox from './SignBox/SignBox';
import SignBoxiPhone from './SignBoxiPhone/SignBoxiPhone';
import { isIphone } from '../../constants';

const Signature = ({ handleBegin, handleEnd, onDoneSignAttende }) => (
    <View style={styles.signatureContainer}>
        {isIphone ? <SignBoxiPhone handleBegin={handleBegin} handleEnd={handleEnd} onDoneSignAttende={onDoneSignAttende} /> : <SignBox handleBegin={handleBegin} handleEnd={handleEnd} />}
    </View>
);

export default Signature;

const styles = StyleSheet.create({
    signatureContainer: {
        paddingHorizontal: isIphone ? 20 : 50,
        marginTop: 20
    },
});