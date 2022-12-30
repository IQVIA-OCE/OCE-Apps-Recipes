import React, { useState } from 'react';
import { themePrimary, neutral06 } from 'apollo-react-native';
import { StyleSheet, TextInput } from 'react-native';

export const FilterInput = ({ placeholder, onChangeInputText, value, style }) => {
    const [isFocused, setIsFocused] = useState(false);
    const onFocus = (e) => {
        setIsFocused(true)
    }
    return (
        <TextInput
            placeholder={placeholder}
            style={[styles.textInput, { borderColor: isFocused ? themePrimary[500] : '#e1e1e1' }, style]}
            onChangeText={onChangeInputText}
            placeholderTextColor={neutral06[400]}
            onFocus={e => onFocus(e)}
            value={value}
        />
    );
};

const styles = StyleSheet.create({
    textInput: {
        paddingLeft: 10,
        fontSize: 16,
        height: 40,
        borderRadius: 5,
        borderWidth: 1
    },

});