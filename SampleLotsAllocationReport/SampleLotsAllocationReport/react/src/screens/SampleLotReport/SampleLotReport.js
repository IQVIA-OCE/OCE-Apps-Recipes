import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";

import { useSelector, useDispatch } from 'react-redux';

import { ApolloProgress, useTheme } from '@oce-apps/apollo-react-native';
import color from 'color'

import { REPORT_TABLE_TITLES, LOADING_STATUS } from '../../constants'
import { ListHeader } from '../../components/ListHeader/ListHeader';
import {
    samplesLotTotalRecordsSelector, sampleLotsRecordsSelector, loadingStatusSelector
} from '../../store/SamplesLotAllocationReport/SamplesLotAllocationReportSelectors';
import {
    bootstrap,
    fetchMoreReportData,
    setReportId
} from '../../store/SamplesLotAllocationReport/SamplesLotAllocationReportSlice';
import { fetchTransactionReportList, fetchLastInventoryDate } from '../../store/TransactionReport/TransactionReportSlice'
import { searchFieldSelector, searchQuerySelector, activeScreenSelector, sortClauseSelector } from '../../store/Search/SearchSelector'
import { setActiveScreen, setSortClause } from '../../store/Search/SearchSlice'
import { TableList } from "../../components/TableList/TableList";
import { TabItemHeader } from '../../components/TabItemHeader/TabItemHeader'


export const SampleLotReport = ({ navigation, title }) => {

    const theme = useTheme();
    const dispatch = useDispatch();
    const loadingStatus = useSelector(loadingStatusSelector);
    const recordsCount = useSelector(samplesLotTotalRecordsSelector);
    const sampleLotsRecords = useSelector(sampleLotsRecordsSelector);
    const searchFieldValue = useSelector(searchFieldSelector);
    const searchQuery = useSelector(searchQuerySelector);
    const sortClause = useSelector(sortClauseSelector);
    const activeScreen = useSelector(activeScreenSelector);
    const isLoading = loadingStatus === LOADING_STATUS.PENDING;

    useEffect(() => {
        if (activeScreen == 'sla' && !isLoading) {
            dispatch(bootstrap());
        }
    }, [searchFieldValue, searchQuery, sortClause])

    const fetchMoreData = () => {
        dispatch(fetchMoreReportData());
    }
    const fetchData = () => {
        dispatch(bootstrap());
    }
    const pressRowItem = (rowItem) => {
        dispatch(setSortClause(null));
        dispatch(setReportId(rowItem.reportId));
        dispatch(fetchLastInventoryDate())
        dispatch(fetchTransactionReportList());
        dispatch(setActiveScreen('transaction'))
        navigation.navigate('TransactionReportScreen');
    }
    const onSort = (sortField, sortOrder) => {
        const sortOrderClause = sortOrder ? 'DESC' : 'ASC';
        const sortClause = `${sortField} ${sortOrderClause}`;
        dispatch(setSortClause(sortClause));
    }
    return (
        <View testID="sampleLotReportContainer" style={styles.flexView}>
            {isLoading && <ApolloProgress style={[styles.loader, {
                backgroundColor: theme.dark
                    ? color(theme.colors.placeholder).darken(0.7).hex()
                    : theme.surface
            }]} testID="loader-wrap" />}
            <TabItemHeader recordsCount={recordsCount} title={title} />
            <View style={styles.tableContainer}>
                <ListHeader titles={REPORT_TABLE_TITLES} onSort={onSort} />
            </View>
            <TableList
                isLoading={isLoading}
                listData={sampleLotsRecords}
                isParent={true}
                onFetchMoreData={fetchMoreData}
                onFetchData={fetchData}
                onPressRowItem={pressRowItem}
                tableHeaders={REPORT_TABLE_TITLES}
            />
        </View >
    );
}


const styles = StyleSheet.create({
    header: {
        fontSize: 20, textAlign: 'center', fontWeight: '700'
    },
    totalRecords: {
        fontSize: 16, fontWeight: '600'
    },
    tableContainer: {
        marginTop: 10
    },
    loader: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.8,
        zIndex: 10,
    },
    flexView: {
        flex: 1
    },
});
