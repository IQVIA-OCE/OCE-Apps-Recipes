import React, { useEffect } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { IconButton, useTheme, Text } from '@oce-apps/apollo-react-native';
import { DTP_DETAIL_TABLE_TITLE, LOADING_STATUS, DTP_SEARCH_DETAIL_FIELDS } from '../../constants';
import { ListHeader } from '../../components/ListHeader/ListHeader';
import { TableList } from '../../components/TableList/TableList'

import {
    productAllocationDetailReportSelector, loadingStatusSelector
} from '../../store/ProductAllocationDetailReport/ProductAllocationDetailReportSliceSelectors';
import { searchFieldSelector, searchQuerySelector, activeScreenSelector, sortClauseSelector } from '../../store/Search/SearchSelector'
import { SearchFilter } from '../../components/SearchFilter/SearchFilter';
import { setSortClause, resetSearchFilters } from '../../store/Search/SearchSlice'
import { fetchDTPDetailReport, fetchMoreDTPDetailReport } from '../../store/ProductAllocationDetailReport/ProductAllocationDetailReportSlice'


export const DTPAllocationReportDetail = ({ navigation }) => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const loadingStatus = useSelector(loadingStatusSelector);
    const searchFieldValue = useSelector(searchFieldSelector);
    const searchQuery = useSelector(searchQuerySelector);
    const dtpDetailReport = useSelector(productAllocationDetailReportSelector);
    const sortClause = useSelector(sortClauseSelector);
    const activeScreen = useSelector(activeScreenSelector);
    const isLoading = loadingStatus === LOADING_STATUS.PENDING;
    useEffect(() => {
        if (activeScreen == 'dtpDetail') {
            dispatch(fetchDTPDetailReport());
        }
    }, [searchFieldValue, sortClause, searchQuery])

    const fetchData = () => {
        dispatch(fetchDTPDetailReport());
    }

    const fetchMoreData = () => {
        dispatch(fetchMoreDTPDetailReport());
    }

    const onSort = (sortField, sortOrder) => {
        const sortOrderClause = sortOrder ? 'DESC' : 'ASC';
        const sortClause = `${sortField} ${sortOrderClause}`;
        dispatch(setSortClause(sortClause));
    }

    const onBack = () => {
        dispatch(resetSearchFilters('dtp'))
        navigation.goBack()
    }

    return (
        <View style={[styles.generalContainer, { backgroundColor: theme.colors.background }]} testID="DTPAllocationReportDetailContainer">
            <View style={styles.headerContainer}>
                <View style={styles.backButton}>
                    <IconButton
                        icon="chevron-left"
                        color={'#0768fd'}
                        size={24}
                        onPress={onBack}
                        style={styles.backIcon}
                    />
                    <TouchableOpacity
                        onPress={onBack}
                        style={styles.backButton}
                    >
                        <Text style={styles.backText}>Go back</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.titleContainer}>
                    <Text testID="detailReportTitle" style={styles.title}>{'Product Allocation Details'}</Text>
                </View>
            </View>

            <SearchFilter isLoading={isLoading} onClear={fetchData} searchOptions={DTP_SEARCH_DETAIL_FIELDS} activeScreen={activeScreen} />
            <View style={styles.tableContainer}>
                <ListHeader titles={DTP_DETAIL_TABLE_TITLE} onSort={onSort} />
            </View>
            <TableList
                isLoading={isLoading}
                listData={dtpDetailReport}
                onFetchData={fetchData}
                onFetchMoreData={fetchMoreData}
                tableHeaders={DTP_DETAIL_TABLE_TITLE}
            />
        </View>
    );
}


const styles = StyleSheet.create({
    generalContainer: {
        padding: 15,
        flex: 1,
    },
    titleContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 20, fontWeight: '700'
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 2,
    },

    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 30,
    }
});
