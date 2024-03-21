import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SEARCH_ATTACHMENTS } from "../../constants/routes";
import { useSelector } from "react-redux";
import { useTheme } from "@oce-apps/apollo-react-native";
import color from 'color';
import { useNavigation } from "@react-navigation/native";

const AttachmentsHeader = () => {
    const theme = useTheme();

    const attachmentsList = useSelector(state => state.attachmentsListReducers.attachmentsList);
    const borderColor = color(theme.colors.background)
      .darken(0.08)
      .rgb()
      .string();

    const navigation = useNavigation();

    return (
        <View style={[styles.container, {backgroundColor: theme.colors.background, borderColor: borderColor}]} testID="headerContainer">
            <View style={styles.textWrapper}>
                <Text style={[styles.text, {color: theme.colors.text}]}>Attachments ({attachmentsList.length})</Text>
            </View>
            <TouchableOpacity
                style={styles.button}
                testID="navigateToSearchButton"
                onPress={() => navigation.navigate(SEARCH_ATTACHMENTS)}
                mode="contained"
            >
                <Text>Add Attachment</Text>
                    </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexWrap: 'nowrap',
        height: 60,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderTopWidth: 1,
    },
    button: {
        width: 130,
        fontSize: 12,
        height: 35,
        padding: 0,
        borderWidth: 1,
        borderColor: '#696969',
        backgroundColor: '#efefef',
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textWrapper: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
    },
    text: {
        fontSize: 14,
        fontWeight: 'bold'
    }
});

export default AttachmentsHeader;
