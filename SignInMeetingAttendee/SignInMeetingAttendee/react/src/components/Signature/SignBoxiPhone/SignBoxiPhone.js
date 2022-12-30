import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { themeGrey, IconButton, Paragraph } from 'apollo-react-native';
import { useDispatch } from 'react-redux';
import SignatureScreen from 'react-native-signature-canvas';
import {
    setSignature
} from '../../../stores/meeting';
import UserDetails from '../../MeetingHeader/UserDetails/UserDetails';
import SignBoxiPhoneHeader from './SignBoxiPhoneHeader'
import SignBoxiPhoneFooter from './SignBoxiPhoneFooter'


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

const SignBoxiPhone = ({ handleBegin, handleEnd, onDoneSignAttende }) => {
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


            <View style={styles.signatureBox} testID={'SignBoxiPhone'}>
                <UserDetails />
                <View style={{ backgroundColor: 'white', flex: 1, borderRadius: 20, paddingHorizontal: 10, }}>
                    <SignBoxiPhoneHeader />
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
                    <SignBoxiPhoneFooter handleClear={handleClear} onDoneSignAttende={onDoneSignAttende} />
                </View>

            </View>
        </View>
    )
};

export default SignBoxiPhone;

const styles = StyleSheet.create({
    signatureBox: {
        width: '100%',
        height: 400,
    },
    signatureScreen: {
        marginTop: 10,
        marginBottom: 10,
        borderColor: themeGrey[400]
    },

});
