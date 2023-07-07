import React, { memo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "apollo-react-native";

const SearchAttachmentItem = ({ attachment, addAttachment }) => {
    const { item } = attachment;
    const { Title, Added = null, Id, FileType } = item;
    const theme = useTheme();
    
    return (
        <View style={styles.container}>
            <View style={styles.titleWrapper}>
                {FileType === 'PDF' ? (
                    <Icon name="file-pdf" size={27} color="#8c8c8c" testID="fileIcon"/>
                ) : (
                    <Icon name="file-multiple" size={24} color="#8c8c8c" testID="fileIcon"/>
                )}
                <Text style={[styles.title, {color: theme.colors.text }]} testID="fileTitle" numberOfLines={1}>{Title}</Text>
            </View>
            <View>
                {Added ? (
                    <Icon name="check" size={30} color='#d0c95a' testID="checkIcon" />
                ) : (
                    <TouchableOpacity style={styles.paperclipWrapper} testID="addAttachment" onPress={() => addAttachment(Id)}>
                        <>
                            <Icon name="paperclip" size={30} color='#b18bf8' />
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
        marginTop: 3,
        paddingHorizontal: 15
    },
    titleWrapper: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
        maxWidth: '75%',
        paddingLeft: 0
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
    paperclipPlus: {
        color: '#b18bf8',
        position: 'absolute',
        top: 6,
        right: -6,
        fontSize: 16
    },
});

export default memo(SearchAttachmentItem);
