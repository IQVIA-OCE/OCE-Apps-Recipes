import React, { memo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const SearchAttachmentItem = ({ attachment, addAttachment }) => {
    const { item } = attachment;
    const { Title, Added = null, Id, FileType } = item;
    
    return (
        <View style={styles.container}>
            <View style={styles.titleWrapper}>
                {FileType === 'PDF' ? (
                    <Icon name="file-pdf" size={27} style={styles.fileIcon} testID="fileIcon"/>
                ) : (
                    <Icon name="file-multiple" size={24} style={styles.fileIcon} testID="fileIcon"/>
                )}
                <Text style={styles.title} testID="fileTitle" numberOfLines={1}>{Title}</Text>
            </View>
            <View>
                {Added ? (
                    <Icon name="check" size={30} style={styles.check} testID="checkIcon" />
                ) : (
                    <TouchableOpacity style={styles.paperclipWrapper} testID="addAttachment" onPress={() => addAttachment(Id)}>
                        <>
                            <Icon name="paperclip" size={30} style={styles.paperclip} />
                            <Text style={styles.paperclipPlus}>+</Text>
                        </>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexWrap: 'nowrap',
        height: 50,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 3
    },
    titleWrapper: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
        maxWidth: '80%',
        paddingLeft: 25
    },
    fileIcon: {
        color: '#8c8c8c',
        position: 'absolute',
        top: -2,
        left: 0
    },
    title: {
        fontSize: 16,
        marginLeft: 10,
        width: '100%'
    },
    paperclipWrapper: {
        position: 'relative',
        marginRight: 10
    },
    paperclip: {
        color: '#b18bf8'
    },
    paperclipPlus: {
        color: '#b18bf8',
        position: 'absolute',
        top: 6,
        right: -6,
        fontSize: 16
    },
    check: {
        marginRight: 10,
        color: '#d0c95a'
    }
});

export default memo(SearchAttachmentItem);
