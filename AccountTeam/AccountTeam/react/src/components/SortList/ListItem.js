import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { sortListSelector } from '../../store/sortSlice/sortListSelector';
import { setSortOption } from '../../store/sortSlice/sortListSlice'

export const ListItem = ({ item, index }) => {
    const dispatch = useDispatch();
    const { sortOption, sortListData } = useSelector(sortListSelector);
    const onSelectField = (item) => {
        dispatch(setSortOption(item));
    }
    return (
        <TouchableOpacity onPress={() => onSelectField(item)} testID={`sortListItem_${index}`}>
            <View testID={`sortListContainer_${index}`} style={[styles.item, { borderBottomWidth: index === sortListData.length - 1 ? 0 : 1 }]}>
                <Text style={styles.title} testID={`sortListLabel_${index}`}>{item.label}</Text>
                <View><MaterialIcon
                    testID={`sortListIcon_${index}`}
                    name={sortOption?.value === item.value ? "check" : null} size={18} /></View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    item: {
        flex: 1,
        paddingVertical: 10,
        borderBottomColor: "#ddd",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10
    },
    title: {
        fontSize: 16,
    },
});
