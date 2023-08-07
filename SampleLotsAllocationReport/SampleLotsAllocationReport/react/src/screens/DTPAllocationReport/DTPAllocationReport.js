import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";

import { useDispatch, useSelector } from 'react-redux';

import { ApolloProgress, useTheme } from 'apollo-react-native';
import color from 'color'

import { DTP_REPORT_TABLE_TITLE, LOADING_STATUS } from '../../constants'
import { ListHeader } from '../../components/ListHeader/ListHeader';
import {
    productAllocationTotalRecordsSelector, productAllocationRecordsSelector, loadingStatusSelector
} from '../../store/ProductAllocationReport/ProductAllocationReportSelectors';
import { fetchDtpAllocationData, fetchMoreDtpAllocationData, setRowItem } from '../../store/ProductAllocationReport/ProductAllocationReportSlice'
import { TableList } from '../../components/TableList/TableList';
import { fetchDTPDetailReport } from '../../store/ProductAllocationDetailReport/ProductAllocationDetailReportSlice'
import { searchFieldSelector, activeScreenSelector, searchQuerySelector, sortClauseSelector } from '../../store/Search/SearchSelector'
import { setActiveScreen, setSortClause } from '../../store/Search/SearchSlice'
import { TabItemHeader } from '../../components/TabItemHeader/TabItemHeader'



export const DTPAllocationReport = ({ navigation, title }) => {

    const theme = useTheme();
    const loadingStatus = useSelector(loadingStatusSelector);
    const recordsCount = useSelector(productAllocationTotalRecordsSelector);
    const productAllocationRecords = useSelector(productAllocationRecordsSelector);
    const searchQuery = useSelector(searchQuerySelector);
    const sortClause = useSelector(sortClauseSelector);
    const activeScreen = useSelector(activeScreenSelector);
    const isLoading = loadingStatus === LOADING_STATUS.PENDING;
    const searchFieldValue = useSelector(searchFieldSelector);

    const dispatch = useDispatch();

    useEffect(() => {
        if (activeScreen == 'dtp' && !isLoading) {
            dispatch(fetchDtpAllocationData());
        }
    }, [searchFieldValue, searchQuery, sortClause])

    useEffect(() => {
        dispatch(fetchDtpAllocationData());
    }, [])

    const fetchMoreData = () => {
        dispatch(fetchMoreDtpAllocationData());
    }
    const fetchData = () => {
        dispatch(fetchDtpAllocationData());
    }
    const pressRowItem = (rowItem) => {
        dispatch(setSortClause(null));
        dispatch(setRowItem(rowItem));
        dispatch(fetchDTPDetailReport());
        dispatch(setActiveScreen('dtpDetail'))
        navigation.navigate('DTPAllocationReportDetail');
    }
    const onSort = (sortField, sortOrder) => {
        const sortOrderClause = sortOrder ? 'DESC' : 'ASC';
        const sortClause = `${sortField} ${sortOrderClause}`;
        dispatch(setSortClause(sortClause));
    }

    return (
        <View testID="dtpAllocationContainer" style={styles.flexView}>
            {isLoading && <ApolloProgress style={[styles.loader, {
                backgroundColor: theme.dark
                    ? color(theme.colors.placeholder).darken(0.7).hex()
                    : theme.surface
            }]} testID="loader-wrap" />}
            <TabItemHeader recordsCount={recordsCount} title={title} />
            <View style={styles.tableContainer}>
                <ListHeader titles={DTP_REPORT_TABLE_TITLE} onSort={onSort} />
            </View>
            <TableList
                isLoading={isLoading}
                listData={productAllocationRecords}
                isParent={true}
                onFetchMoreData={fetchMoreData}
                onFetchData={fetchData}
                onPressRowItem={pressRowItem}
                tableHeaders={DTP_REPORT_TABLE_TITLE}
            />
        </View >
    );
}



const styles = StyleSheet.create({
    flexView: {
        flex: 1
    },
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
});
