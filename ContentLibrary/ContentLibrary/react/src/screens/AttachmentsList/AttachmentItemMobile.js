import React from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { DateTime } from 'luxon';
import { Tooltip } from "apollo-react-native";

const AttachmentItemMobile = ({ attachment, handleDelete, handleOpen }) => {
    const { item } = attachment;
    const { ContentDocument } = item;
    return (
        <TouchableWithoutFeedback onPress={() => ContentDocument.synced ? handleOpen(ContentDocument.Id) : null} testID="touchableButton">
            <View style={styles.container} testID="attachment-item-container">
                {ContentDocument.FileExtension === 'pdf' ? (
                    <Icon name="file-pdf" size={27} style={styles.fileIcon} />
                ) : (
                    <Icon name="file-multiple" size={24} style={styles.fileIcon} />
                )}
                <View style={{
                    width: '60%', position: 'relative', paddingRight: 25
                }}>
                    <View>
                        <Text style={styles.title} numberOfLines={1}>{ContentDocument.Title}</Text>
                        {ContentDocument.Description && (
                            <Text style={{ fontSize: 12 }}>{ContentDocument.Description}</Text>
                        )}
                    </View>
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
                <View>
                    <View style={styles.createdDate}>
                        <Text style={{ fontSize: 12 }}>{DateTime.fromISO(ContentDocument.ContentModifiedDate).toFormat('M/d/yy')}</Text>
                    </View>
                    <View style={styles.owner}>
                        <Text style={{ fontSize: 12, maxWidth: 75 }} numberOfLines={1}>{ContentDocument.Owner?.Name || ''}</Text>
                    </View>
                </View>
                <TouchableOpacity testID="deleteIcon" onPress={() => handleDelete(item.Id)}>
                    <Icon name="delete-forever" size={25} />
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexWrap: 'nowrap',
        minHeight: 60,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomColor: '#e9e9e9',
        borderBottomWidth: 1,
        paddingLeft: 30,
    },
    title: {
        maxWidth: '100%',
        fontSize: 12
    },
    fileIcon: {
        position: 'absolute',
        top: '50%',
        marginTop: -12,
        left: 0,
        color: '#8c8c8c'
    },
    infoIcon: {
        display: 'flex',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoIconWrapper: {
        position: 'absolute',
        top: -12,
        right: -1,
    },
    description: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    createdDate: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default AttachmentItemMobile;
