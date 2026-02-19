import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { themePrimary, useTheme, Text } from '@oce-apps/apollo-react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector, useDispatch } from 'react-redux';
import { SortList } from '../SortList/SortList';
import { sortListSelector } from '../../store/sortSlice/sortListSelector';
import { accountSelector } from '../../store/accountSlice/accountSelector';
import { setSortOrder, setSortListVisibile } from '../../store/sortSlice/sortListSlice'
import { setInfoContainerVisible } from '../../store/accountSlice/accountSlice'
import { LOADING_STATUS } from '../../constants';

export const AccountTeamSortList = () => {
    const theme = useTheme();
    const { sortOption, sortAscOrder, shouldShowSortList } = useSelector(sortListSelector);
    const { loadingStatus } = useSelector(accountSelector);
    const dispatch = useDispatch();
    useEffect(() => {
        if ((loadingStatus === LOADING_STATUS.SUCCESS)) {
            dispatch(setSortListVisibile(false));
        }
    }, [loadingStatus])
    const onTapSortList = () => {
        if (shouldShowSortList) {
            dispatch(setSortListVisibile(false));
            return;
        }
        dispatch(setSortListVisibile(true));
        dispatch(setInfoContainerVisible(false))
    }
    const onToggleSort = () => {
        dispatch(setSortOrder(!sortAscOrder));
    }
    return (
        <View style={styles.row}>
            <TouchableOpacity testID={'sortListLink'} onPress={onTapSortList}>
                <View style={styles.linkContainer}>
                    <View><Text style={[styles.linkText, { color: theme.dark ? theme.colors.primary : themePrimary[500] }]} testID={'sortText'} numberOfLines={1}>Sort by: {sortOption?.label}</Text></View>
                </View>
            </TouchableOpacity>
            {shouldShowSortList && <SortList testID={'sortList'} />}
            <TouchableOpacity onPress={onToggleSort} testID={'sortListIcon'}>
                <Icon name={sortAscOrder ? 'arrow-up' : 'arrow-down'} size={18} color={theme.dark ? theme.colors.primary : themePrimary[500]} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    linkContainer: {
        alignItems: 'flex-start',
        flexDirection: 'row',


    },
    linkText: {
        fontSize: 18,
        width: 150
    }
});
