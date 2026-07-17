import React from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { DateTime } from 'luxon';
import { Tooltip, useTheme } from "@oce-apps/apollo-react-native";
import color from 'color';

const AttachmentItemPad = ({ attachment, handleDelete, handleOpen }) => {
    const { item } = attachment;
    const { ContentDocument } = item;
    const theme = useTheme();

    const iconColor = color(theme.colors.text)
      .darken(0.55)
      .rgb()
      .string();

    return (
        <TouchableWithoutFeedback onPress={() => ContentDocument.synced ? handleOpen(ContentDocument.Id) : null} testID="touchableButton">
            <View style={styles.container}>
                {ContentDocument.FileExtension === 'pdf' ? (
                    <Icon name="file-pdf" size={27} color='#8c8c8c'/>
                ) : (
                    <Icon name="file-multiple" size={24} color='#8c8c8c' />
                )}
                <View style={styles.titleWrapper}>
                    <Text style={[styles.title, {color: theme.colors.text}]} numberOfLines={1}>{ContentDocument.Title}</Text>
                    {!ContentDocument.synced && (
                        <TouchableOpacity testID="infoIcon" style={styles.infoIconWrapper}>
                            <Tooltip
                                placement="top"
                                subtitle="Sync required for preview"
                                color="#363636"
                                icon={() => <Icon name="sync-alert" size={24} style={{color: iconColor}}/>}
                            />
                        </TouchableOpacity>
                    )}
                </View>
                <View style={styles.description}>
                    <Text style={{color: theme.colors.text}}>{ContentDocument.Description}</Text>
                </View>
                <View style={styles.owner}>
                    <Text style={{color: theme.colors.text}}>{ContentDocument.Owner?.Name || ''}</Text>
                </View>
                <View style={styles.createdDate}>
                    <Text style={{color: theme.colors.text}}>{DateTime.fromISO(ContentDocument.ContentModifiedDate).toFormat('EEE, MMM d, yyyy, t')}</Text>
                </View>
                <View>
                    <TouchableOpacity onPress={() => handleDelete(item.Id)} testID="deleteIcon">
                        <Icon name="delete-forever" size={30} color={iconColor} />
                    </TouchableOpacity>
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
