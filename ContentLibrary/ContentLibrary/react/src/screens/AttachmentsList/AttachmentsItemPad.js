import React from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { DateTime } from 'luxon';
import { Tooltip } from "apollo-react-native";

const AttachmentItemPad = ({ attachment, handleDelete, handleOpen }) => {
    const { item } = attachment;
    const { ContentDocument } = item;

    return (
        <TouchableWithoutFeedback onPress={() => ContentDocument.synced ? handleOpen(ContentDocument.Id) : null} testID="touchableButton">
            <View style={styles.container}>
                {ContentDocument.FileExtension === 'pdf' ? (
                    <Icon name="file-pdf" size={27} style={styles.fileIcon} />
                ) : (
                    <Icon name="file-multiple" size={24} style={styles.fileIcon} />
                )}
                <View style={styles.titleWrapper}>
                    <Text style={styles.title} numberOfLines={1}>{ContentDocument.Title}</Text>
                    {!ContentDocument.synced && (
                        <TouchableOpacity testID="infoIcon" style={styles.infoIconWrapper}>
                            <Tooltip
                                placement="top"
                                subtitle="Sync required for preview"
                                color="#363636"
                                icon={() => <Icon name="sync-alert" size={24} />}
                            />
                        </TouchableOpacity>
                    )}
                </View>
                <View style={styles.description}>
                    <Text>{ContentDocument.Description}</Text>
                </View>
                <View style={styles.owner}>
                    <Text>{ContentDocument.Owner?.Name || ''}</Text>
                </View>
                <View style={styles.createdDate}>
                    <Text>{DateTime.fromISO(ContentDocument.ContentModifiedDate).toFormat('EEE, MMM d, yyyy, t')}</Text>
                </View>
                <View>
                    <TouchableWithoutFeedback onPress={() => handleDelete(item.Id)} testID="deleteIcon">
                        <Icon name="delete-forever" size={30} />
                    </TouchableWithoutFeedback>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexWrap: 'nowrap',
        height: 50,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomColor: '#e9e9e9',
        borderBottomWidth: 1,
        paddingLeft: 30,
    },
    title: {
        maxWidth: '75%',
    },
    fileIcon: {
        position: 'absolute',
        top: '50%',
        marginTop: -12,
        left: 0,
        color: '#8c8c8c'
    },
    infoIcon: {
        position: 'absolute',
        top: -1,
        right: -3
    },
    infoIconWrapper: {
        position: 'absolute',
        top: -12,
        right: -1,
    },
    titleWrapper: {
        width: '25%',
        paddingRight: 20,
    },
    description: {
        width: '15%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    owner: {
        width: '15%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    createdDate: {
        width: '25%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default AttachmentItemPad;
