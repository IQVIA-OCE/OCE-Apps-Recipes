import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { themeGrey, Title, IconButton, secondaryBlue } from 'apollo-react-native';
import { useSelector, useDispatch } from 'react-redux';
import { UserContext } from '../../screens/MeetingsAttendeeList/MeetingAttendeeList'
import { isIphone, NAMESPACE } from '../../constants';
import { setApplicationLock } from '../../stores/meeting'
import { localized } from 'oce-apps-bridges';
import TouchID from 'react-native-touch-id';


const Header = ({ onCancel, onPrintAttendeeList, onDoneSignAttende, showSignatureWindow }) => {
    const dispatch = useDispatch()
    const [currentUser, setCurrentUser] = useState(null);
    const { meetingDetails, isProcessing, firstName, signature, isApplicationLock } = useSelector((state) => state.meeting);
    const contextData = React.useContext(UserContext);
    useEffect(() => {
        if (meetingDetails[0]) {
            const { records } = meetingDetails[0][`${NAMESPACE}MeetingMember__r`];
            const currentUserInfo = records && records.filter(record => record.Id === contextData);
            setCurrentUser(currentUserInfo[0]);
        }
        if (!showSignatureWindow) {
            setCurrentUser(null);
        }
    }, [meetingDetails, contextData, showSignatureWindow]);

    const onLockSystem = () => {
        const optionalConfigObject = {
            fallbackLabel: '',
            unifiedErrors: false,
            passcodeFallback: true,
        };
        TouchID.authenticate('To Lock the screen until finish the signature', optionalConfigObject)
            .then(success => {
                if (success) {
                    dispatch(setApplicationLock(!isApplicationLock));
                }
            })
            .catch(error => {
            });
    }

    return (
        <View style={styles.modalHeader} testID="header">
            {isIphone && <IconButton
                disabled={isApplicationLock}
                icon="close"
                color={secondaryBlue[500]}
                size={24}
                onPress={onCancel}
            />
            }
            {!isIphone && <TouchableOpacity onPress={onCancel}><Title style={styles.headerText}>{localized("Global_Cancel", "Cancel")}</Title></TouchableOpacity>}
            <Title style={styles.headerText}>{localized("Sign_In", "Sign In")} {currentUser ? currentUser.Name : (firstName ? firstName : '')}</Title>
            {isIphone && (showSignatureWindow ? <IconButton
                icon={isApplicationLock ? "lock" : "lock-open"}
                color={secondaryBlue[500]}
                size={24}
                onPress={onLockSystem}
            /> : <IconButton
                icon="printer"
                color={secondaryBlue[500]}
                size={24}
                onPress={(currentUser || firstName) ? onDoneSignAttende : onPrintAttendeeList}
            />)}
            {!isIphone && <TouchableOpacity onPress={((currentUser || firstName) && showSignatureWindow) ? onDoneSignAttende : onPrintAttendeeList} disabled={(isProcessing || !signature) && showSignatureWindow}>
                <View style={styles.headerActionBtn}>
                    <Title style={styles.headerText}>{((currentUser || firstName) && showSignatureWindow) ? localized("Done", "Done") : localized("Print", "Print")}</Title>
                </View>
            </TouchableOpacity>
            }
        </View>
    )
};

export default Header;

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
