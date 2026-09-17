import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Checkbox, Paragraph, Select, secondaryBlue, themeGrey } from '@oce-apps/apollo-react-native';
import { updateMeal, updateMealOption } from '../../../../stores/meeting'
import { UserContext } from '../../../../screens/MeetingsAttendeeList/MeetingAttendeeList'
import { NAMESPACE } from '../../../../constants';
import { localized } from '@oce-apps/oce-apps-bridges';


const SignFooter = ({ handleClear }) => {
    const [pickListOptions, setPickListOptions] = useState([]);
    const [selectedMealOption, setSelectedMealOption] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [isMeal, setIsMeal] = useState(false);
    const contextData = React.useContext(UserContext);
    const { meetingDetails, meetingLayouts, meetingConfig, isProcessing, signature, firstName } = useSelector((state) => state.meeting);
    useEffect(() => {
        if (meetingConfig[0] && meetingConfig[0][`${NAMESPACE}MealFieldType__c`] === 'Picklist') {
            const mealFieldType = meetingLayouts.fields && meetingLayouts.fields.filter((layout) => layout.name === `${NAMESPACE}MealOption__c`);
            if (mealFieldType) {
                setPickListOptions(mealFieldType[0].picklistValues)
            }

        }
        const { records } = meetingDetails[0][`${NAMESPACE}MeetingMember__r`];
        if (records) {
            const currentUserInfo = records.filter(record => record.Id === contextData);
            setCurrentUser(currentUserInfo[0]);
        }

    }, [meetingConfig, contextData]);
    const dispatch = useDispatch();
    const onIsMeal = () => {
        setIsMeal(!isMeal);
        dispatch(updateMeal(!isMeal))
    }
    const onChangeMealOption = (selected) => {
        setSelectedMealOption(selected);
        dispatch(updateMealOption(selected.value))
    }
    return (
        <View testID={'SignFooter'}>
            <View style={styles.signFooter}>
                <Paragraph style={styles.meetingOwnerText}>{currentUser ? currentUser.Name : (firstName ? firstName : '')}</Paragraph>
                <Paragraph style={styles.signInfo}>{localized('Sign_above', 'Sign Above this line')}</Paragraph>
                <TouchableOpacity onPress={handleClear} disabled={isProcessing || !signature}><Paragraph style={styles.clearSignatureText}>{localized('Clear_signature', 'Clear Signature')}</Paragraph></TouchableOpacity>
            </View>
            <View style={styles.mealRow}>
                <Paragraph style={styles.mealLabel}>{localized('Meal_Question', 'Meal?')}</Paragraph>
                {meetingConfig[0] && meetingConfig[0][`${NAMESPACE}MealFieldType__c`] === 'Picklist' ? <View style={styles.mealPicker}>
                    <Select
                        options={pickListOptions}
                        value={selectedMealOption}
                        onChange={onChangeMealOption}
                        placeholder="Select Meal Option..."
                        style={styles.mealOptionSelect}
                        width={260}
                    />
                </View>
                    : <Checkbox onChange={onIsMeal} checked={isMeal} size='small' />
                }
            </View>
        </View>
    )
};


export default SignFooter;

const styles = StyleSheet.create({
    signFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10
    },
    mealRow: {
        flexDirection: 'row',
        marginTop: 15,
        alignItems: 'center'
    },
    mealOptionSelect: {
        borderWidth: 1,
        borderColor: themeGrey[400],
        marginLeft: 10
    },
    meetingOwnerText: {
        fontSize: 14
    },
    signInfo: {
        color: '#818181',
        fontSize: 14
    },
    clearSignatureText: {
        color: secondaryBlue[500],
        fontSize: 14
    },
    mealLabel: {
        fontWeight: 'bold',
        fontSize: 16
    }
});
