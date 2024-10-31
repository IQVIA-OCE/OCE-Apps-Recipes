import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme, Text } from '@oce-apps/apollo-react-native';


export const TabItemHeader = ({ title, recordsCount }) => {
    const theme = useTheme();
    return (
        <View testID="tabItemHeader">
            <Text testID="title" style={styles.header}>{title}</Text>
            <Text testID="totalRecords" style={styles.totalRecords}>Total Records : {recordsCount}</Text>
        </View >
    );
}



const styles = StyleSheet.create({
    header: {
        fontSize: 20, textAlign: 'center', fontWeight: '700'
    },
    totalRecords: {
        fontSize: 16, fontWeight: '600'
    }
});
