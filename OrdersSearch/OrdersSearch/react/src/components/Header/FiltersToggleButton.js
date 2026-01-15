import React from 'react';
import { StyleSheet, View } from 'react-native';
import { themePrimary, Text, useTheme } from '@oce-apps/apollo-react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

export const FiltersToggleButton = ({ title, expanded, filterCount }) => {
    const theme = useTheme();
    return (
        <View style={styles.filterButton} testID={'accordionHeader'}>
            <Text style={[styles.header, { color: theme.dark ? theme.colors.primary : themePrimary[500] }]} testID={'accordionTitle'}>{title}</Text>
            <View style={styles.iconContainer}>
                <MaterialIcon
                    testID={`accordionIcon`}
                    color={theme.dark ? theme.colors.primary : theme.colors.text}
                    name={expanded ? "chevron-right" : "chevron-down"} size={20} />
                <Text style={[styles.filterActiveText, { color: theme.dark ? theme.colors.primary : themePrimary[500] }]}>({filterCount})</Text>
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
        fontSize: 16
    }

});
