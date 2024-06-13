import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { themeGrey, useTheme } from '@oce-apps/apollo-react-native';
import color from 'color'
import { useDispatch } from 'react-redux';
import SignatureScreen from 'react-native-signature-canvas';
import {
    setSignature, setIsProcessing
} from '../../../stores/meeting';
import UserDetails from '../../MeetingHeader/UserDetails/UserDetails';
import SignBoxiPhoneHeader from './SignBoxiPhoneHeader'
import SignBoxiPhoneFooter from './SignBoxiPhoneFooter'


const SignBoxiPhone = ({ handleBegin, handleEnd, onDoneSignAttende }) => {
    useEffect(() => {
        setTimeout(() => {
            dispatch(setIsProcessing(false))
        }, 1000)
    }, [])
    const theme = useTheme();
    const webStyle = `.m-signature-pad {
        box-shadow: none; border: none;border-radius: 0;
        margin-left: 0px;
        margin-top: 0px;
        background-color: ${theme.colors.background};
        } 
        .m-signature-pad--body {border: none;border-radius: 0; background-color: ${theme.colors.background};}
        .m-signature-pad--footer {display: none; margin: 0px;}
        body,html {
          width: 100%; 
          height: 100%;
          background-color: ${theme.colors.background};
        }`;
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
                <View style={{ backgroundColor: theme.colors.background, borderColor: theme.dark ? color(theme.colors.surface).lighten(0.6).hex() : themeGrey[500], flex: 1, borderRadius: 20, paddingHorizontal: 10, }}>
                    <SignBoxiPhoneHeader />
                    <SignatureScreen
                        ref={signRef}
                        onBegin={handleBegin}
                        onEnd={() => { onSignatureEnd(); handleEnd(); }}
                        onOK={handleOK}
                        webviewContainerStyle={{ backgroundColor: theme.colors.background }}
                        backgroundColor={theme.colors.background}
                        onGetData={handleData}
                        penColor={theme.colors.text}
                        webStyle={webStyle}
                        bgWidth={'100%'}
                        overlayWidth={'100%'}
                        bgHeight={300}
                        style={[styles.signatureScreen, { borderColor: theme.dark ? color(theme.colors.surface).lighten(0.6).hex() : themeGrey[400] }]}
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
        height: 400,
    },
    signatureScreen: {
        marginTop: 10,
        marginBottom: 10,
        borderWidth: 1
    },

});
