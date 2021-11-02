import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { themeGrey } from 'apollo-react-native';
import { useDispatch } from 'react-redux';
import SignatureScreen from 'react-native-signature-canvas';
import {
    setSignature
} from '../../../stores/meeting';


import SignFooter from './SignFooter/SignFooter'

const webStyle = `
    .m-signature-pad {
      width: '100%'; 
      height: 280px;
      margin-left: 0px;
      margin-top: 0px;
      -webkit-box-shadow: none;
      -moz-box-shadow: none;
      box-shadow: none;
     }
     .m-signature-pad--footer
    .save {
        display: none;
    }
    .clear {
        display: none;
    }
        `;

const SignBox = ({ handleBegin, handleEnd }) => {
    const signRef = useRef();
    const dispatch = useDispatch()
    const handleOK = (signature) => {
        dispatch(setSignature(signature));
    };
    const handleData = (data) => {
        data = JSON.parse(data);
        data.forEach((stroke) => {
            stroke.points.forEach((p) => { });
        });
    };
    const handleClear = () => {
        signRef.current.clearSignature();
        dispatch(setSignature(null));
    };
    const onSignatureEnd = () => {
        signRef.current.readSignature();
    }
    return (
        <View>


            <View style={styles.signatureBox}>
                <SignatureScreen
                    ref={signRef}
                    onBegin={handleBegin}
                    onEnd={() => { onSignatureEnd(); handleEnd(); }}
                    onOK={handleOK}
                    backgroundColor={'#fff'}
                    onGetData={handleData}
                    webStyle={webStyle}
                    bgWidth={'100%'}
                    overlayWidth={'100%'}
                    bgHeight={300}
                    style={styles.signatureScreen}
                    descriptionText={""}
                />
            </View>
            <SignFooter handleClear={handleClear} />
        </View>
    )
};

export default SignBox;

const styles = StyleSheet.create({
    signatureBox: {
        borderColor: themeGrey[400],
        width: '100%',
        height: 280
    },
    signatureScreen: {
        marginBottom: 10,
        borderWidth: 1,
        borderColor: themeGrey[400]
    },

});