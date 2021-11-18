import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SEARCH_ATTACHMENTS } from "../../constants/routes";
import { withNavigation } from "react-navigation";
import { useSelector } from "react-redux";

const AttachmentsHeader = ({ navigation }) => {

    const attachmentsList = useSelector(state => state.attachmentsListReducers.attachmentsList);

    return (
        <View style={styles.container} testID="headerContainer">
            <View style={styles.textWrapper}>
                <Text style={styles.text}>Attachments ({attachmentsList.length})</Text>
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
        backgroundColor: '#f8f8f8',
        paddingHorizontal: 10,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e9e9e9',
        borderTopWidth: 1,
        borderTopColor: '#e9e9e9',
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

export default withNavigation(AttachmentsHeader);
