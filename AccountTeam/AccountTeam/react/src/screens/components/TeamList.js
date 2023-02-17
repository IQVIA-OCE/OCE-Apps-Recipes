import React, { useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from 'apollo-react-native';
import { accountSelector, searchAccountSelector } from '../../store/accountSlice/accountSelector';
import { fetchAccountTeams, fetchMoreAccountTeams, setiPhoneContainerWidth, setInfoContainerVisible } from '../../store/accountSlice/accountSlice'
import { setSortListVisibile } from '../../store/sortSlice/sortListSlice'
import { sortListSelector } from '../../store/sortSlice/sortListSelector'
import { ListRow } from './ListRow'
import { Seperator } from '../../components/Seperator'
import { ListEmptyComponent } from '../../components/ListEmptyComponent/ListEmptyComponent'

export const TeamList = ({ isBootstrapping, ...props }) => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const { accountTeams, shouldShowDetailScreen } = useSelector(accountSelector);
    const { searchQuery } = useSelector(searchAccountSelector);
    const { sortOption, sortAscOrder, isFilterApplied, shouldShowSortList } = useSelector(sortListSelector);
    useEffect(() => {
        if (!isBootstrapping) dispatch(fetchAccountTeams());
    }, [searchQuery, sortOption, sortAscOrder, isFilterApplied])
    const loadMoreData = () => {

        dispatch(fetchMoreAccountTeams());

    }
    const setLayout = useCallback(e => {
        dispatch(setiPhoneContainerWidth(e.nativeEvent.layout.width))
    })
    const onScroll = () => {
        if (shouldShowSortList) {
            dispatch(setSortListVisibile(false));
        }
        if (shouldShowDetailScreen) {
            dispatch(setInfoContainerVisible(false))
        }
    }
    return (
        <View style={styles.listContainer} {...props} testID={'teamListContainer'} onLayout={setLayout}>
            <View style={[styles.flatListContainer,]}>
                <FlatList
                    testID={'teamList'}
                    onScroll={() => onScroll()}
                    keyExtractor={(item, index) => index}
                    ItemSeparatorComponent={() => <Seperator />}
                    data={accountTeams}
                    style={{ backgroundColor: theme.colors.background }}
                    onEndReached={loadMoreData}
                    onEndReachedThreshold={0.3}
                    initialNumToRender={20}
                    refreshing={isBootstrapping}
                    ListEmptyComponent={() => !isBootstrapping && < ListEmptyComponent />}
                    renderItem={({ item, index }) => <ListRow item={item} index={index} />}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    listContainer: {
        zIndex: -1,
        marginTop: 25,
        flex: 1,
    },
    flatListContainer: {
        borderRadius: 10, backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.5,
        maxHeight: 500
    },
    triangle: {
        width: 10,
        height: 10,
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderLeftWidth: 12,
        borderRightWidth: 10,
        borderBottomWidth: 10,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: "blue",
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 12,
        alignItems: 'center',
        transform: [{ rotate: '90deg' }]


    },
});
