import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Checkbox, Paragraph, Select, themeGrey } from '@oce-apps/apollo-react-native';
import { updateMeal, updateMealOption } from '../../../stores/meeting'
import { NAMESPACE } from '../../../constants'


const SignBoxiPhoneHeader = () => {
    const [pickListOptions, setPickListOptions] = useState([]);
    const [selectedMealOption, setSelectedMealOption] = useState(null);
    const [isMeal, setIsMeal] = useState(false);
    const { meetingLayouts, meetingConfig } = useSelector((state) => state.meeting);
    useEffect(() => {
        if (meetingConfig[0] && meetingConfig[0][`${NAMESPACE}MealFieldType__c `] === 'Picklist') {
            const mealFieldType = meetingLayouts.fields.filter((layout) => layout.name === `${NAMESPACE}MealOption__c`);
            setPickListOptions(mealFieldType[0].picklistValues)
        }

    }, [meetingConfig]);
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
        <View style={styles.mealRow}>
            <Paragraph style={styles.mealLabel}>{'Meal?'}</Paragraph>
            {meetingConfig[0] && meetingConfig[0][`${NAMESPACE}MealFieldType__c`] === 'Picklist'
                ? <View style={styles.mealPicker} testID={'Select'}>
                    <Select
                        options={pickListOptions}
                        value={selectedMealOption}
                        onChange={onChangeMealOption}
                        placeholder="Select Meal Option..."
                        style={styles.mealOptionSelect}
                        width={160}
                        testID={'meal-option'}
                    />
                </View>
                : <Checkbox onChange={onIsMeal} checked={isMeal} size='small' testID={'Checkbox'}/>
            }
        </View>
    )
};


export default SignBoxiPhoneHeader;

const styles = StyleSheet.create({
    mealRow: {
        flexDirection: 'row',
        marginTop: 15,
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    mealOptionSelect: {
        borderWidth: 1,
        borderColor: themeGrey[400],
        marginLeft: 10
    },
    mealLabel: {
        fontWeight: 'bold',
        fontSize: 16
    }
});
