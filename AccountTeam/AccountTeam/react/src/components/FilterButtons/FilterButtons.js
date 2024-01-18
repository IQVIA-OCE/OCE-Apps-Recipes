import React from 'react';
import { Button } from 'apollo-react-native';
import { StyleSheet, View } from 'react-native';

export const FilterButtons = ({ onApplyfilter, onClearFilter }) => {
    return (
        <View style={styles.row} testID={'filterButtonContainer'}>
            <Button
                onPress={onApplyfilter}
                mode="contained"
                style={styles.button}
            >Apply</Button>
            <Button
                onPress={onClearFilter}
                mode="outlined"
                style={styles.button}
            >
                Clear
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row'
    },
    button: {
        marginRight: 10
    }

});