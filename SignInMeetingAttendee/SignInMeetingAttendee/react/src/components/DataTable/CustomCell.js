
import React from 'react';
import { useSelector } from 'react-redux';
import { Paragraph } from '@oce-apps/apollo-react-native';
import { View } from 'react-native';
import { localized } from '@oce-apps/oce-apps-bridges';
import { NAMESPACE } from '../../constants'

const CustomCell = ({ row, column }) => {
    const { meetingConfig } = useSelector((state) => state.meeting);
    const mealOption = column.accessor === `${NAMESPACE}MealOption__c` ? meetingConfig[0] && meetingConfig[0][`${NAMESPACE}MealFieldType__c`] === 'Picklist' ? row[column.accessor]
        : (row[`${NAMESPACE}Meal__c`] ? localized('yes', 'Yes') : localized('no', 'No')) : row[column.accessor]
    return (
        <View key={row.Id} testID={'CustomCell'}>
            <Paragraph>{mealOption}</Paragraph>
        </View>
    );
};

export default CustomCell;
