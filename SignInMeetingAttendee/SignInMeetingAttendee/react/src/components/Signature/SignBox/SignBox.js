import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { themeGrey, useTheme } from 'apollo-react-native';
import color from 'color'
import { useDispatch } from 'react-redux';
import SignatureScreen from 'react-native-signature-canvas';
import {
  setSignature, setIsProcessing
} from '../../../stores/meeting';


import SignFooter from './SignFooter/SignFooter'


const SignBox = ({ handleBegin, handleEnd }) => {
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
  const handleClear = () => {
    signRef.current.clearSignature();
    dispatch(setSignature(null));
  };
  const onSignatureEnd = () => {
    signRef.current.readSignature();
  }
  return (
    <View>


      <View style={[styles.signatureBox, { borderColor: theme.dark ? theme.colors.background : themeGrey[500] }]} testID={'SignBox'}>
        <SignatureScreen
          ref={signRef}
          onBegin={handleBegin}
          onEnd={() => { onSignatureEnd(); handleEnd(); }}
          onOK={handleOK}
          webviewContainerStyle={{ backgroundColor: theme.colors.background }}
          backgroundColor={theme.colors.background}
          webStyle={webStyle}
          penColor={theme.colors.text}
          style={[styles.signatureScreen, { borderColor: theme.dark ? color(theme.colors.surface).lighten(0.6).hex() : themeGrey[500] }]}
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
    height: 280,
  },
  signatureScreen: {
    marginBottom: 10,
    borderWidth: 1,
  },

});
