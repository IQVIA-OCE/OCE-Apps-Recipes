import React, { useEffect } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { IconButton, useTheme, Text } from 'apollo-react-native';
import { TRANSACTION_TABLE_TITLE, LOADING_STATUS } from '../../constants';
import { fetchTransactionReportList, fetchMoreTransactionReportList } from '../../store/TransactionReport/TransactionReportSlice'
import { TableList } from "../../components/TableList/TableList";
import {
    transactionReportSelector, loadingStatusSelector
} from '../../store/TransactionReport/TransactionReportSliceSelectors';

import { searchFieldSelector, activeScreenSelector, searchQuerySelector, sortClauseSelector } from '../../store/Search/SearchSelector'
import { setSortClause, resetSearchFilters } from '../../store/Search/SearchSlice'
import { ListHeader } from "../../components/ListHeader/ListHeader";
export const TransactionReportScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const loadingStatus = useSelector(loadingStatusSelector);
    const transactionRecords = useSelector(transactionReportSelector);
    const searchQuery = useSelector(searchQuerySelector);
    const sortClause = useSelector(sortClauseSelector);
    const searchFieldValue = useSelector(searchFieldSelector);
    const activeScreen = useSelector(activeScreenSelector);
    const isLoading = loadingStatus === LOADING_STATUS.PENDING;


    useEffect(() => {
        if (activeScreen == 'transaction') {
            dispatch(fetchTransactionReportList());
        }
    }, [searchFieldValue, searchQuery, sortClause])

    const fetchData = () => {
        dispatch(fetchTransactionReportList());
    }
    const fetchMoreData = () => {
        dispatch(fetchMoreTransactionReportList());
    }

    const onSort = (sortField, sortOrder) => {
        const sortOrderClause = sortOrder ? 'DESC' : 'ASC';
        const sortClause = `${sortField} ${sortOrderClause}`;
        dispatch(setSortClause(sortClause));
    }
    const onBack = () => {
        dispatch(resetSearchFilters('sla'))
        navigation.goBack()
    }
    return (
        <View style={[styles.generalContainer, { backgroundColor: theme.colors.background }]} testID="transactionReportContainer">
            <View style={styles.headerContainer}>
                <View
                    style={styles.backButton}
                >
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
                    <Text testID="sampleLotTitle" style={styles.title}>{'Transaction Details'}</Text>
                </View>
            </View>
            <View style={styles.tableContainer}>
                <ListHeader titles={TRANSACTION_TABLE_TITLE} onSort={onSort} />
            </View>
            <TableList
                isLoading={isLoading}
                listData={transactionRecords}
                onFetchMoreData={fetchMoreData}
                onFetchData={fetchData}
                tableHeaders={TRANSACTION_TABLE_TITLE}
            />

        </View>
    );
}


const styles = StyleSheet.create({

    generalContainer: {
        padding: 15,
        flex: 1,
    },
    flexView: {
        flex: 1
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
        height: 30
    }
});