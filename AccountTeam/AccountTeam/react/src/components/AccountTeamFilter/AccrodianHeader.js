import React from 'react';
import { themePrimary } from 'apollo-react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StyleSheet, View, Text } from 'react-native';

export const AccrodianHeader = ({ title, expanded, filterCount }) => {
    return (
        <View style={styles.filterButton} testID={'accordianHeader'}>
            <Text style={styles.header} testID={'accordianTitle'}>{title}</Text>
            <View style={styles.iconContainer}>
                <MaterialIcon
                    testID={`accordianIcon}`}
                    name={expanded ? "chevron-right" : "chevron-down"} size={20} />
                <Text style={styles.filterActiveText}>({filterCount})</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    filterButton: {
        borderRadius: 10,
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    iconContainer: {
        alignItems: 'center',
        flexDirection: 'row'
    },
    header: {
        fontSize: 16,
        fontWeight: '500'
    },
    filterActiveText: {
        color: themePrimary[500],
        fontSize: 16
    }

});