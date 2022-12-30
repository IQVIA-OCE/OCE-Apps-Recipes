import React from 'react';
import { StyleSheet, View } from 'react-native';

export const Seperator = () => {
    return (
        <View testID="flatListSeperator" style={styles.seperator} />
    );
};

const styles = StyleSheet.create({
    seperator: {
        height: 5,
        backgroundColor: '#000', opacity: 0.1
    },
});
