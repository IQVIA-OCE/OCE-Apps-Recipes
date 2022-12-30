import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { ListItem } from './ListItem'
import { sortListSelector } from '../../store/sortSlice/sortListSelector';

export const SortList = ({ ...props }) => {
    const { sortListData } = useSelector(sortListSelector);
    return (
        <View style={styles.listContainer} {...props}>
            <View style={styles.triangle} />
            <View style={styles.flatListContainer}>
                <FlatList
                    testID={'sortOptionList'}
                    data={sortListData}
                    renderItem={({ item, index }) => <ListItem item={item} index={index} />}
                    keyExtractor={item => item.id}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    listContainer: {
        alignItems: 'center',
        position: 'absolute',
        top: 20,
        zIndex: 999999
    },
    triangle: {
        width: 10,
        height: 10,
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderBottomWidth: 12,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: "#fff",
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 12,

    },
    flatListContainer: {
        backgroundColor: '#fff',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 12,
        borderRadius: 10,
        marginHorizontal: 10,
        width: 220,
    }
});
