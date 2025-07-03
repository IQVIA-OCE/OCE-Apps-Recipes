import React, { useRef } from "react";
import { FlatList } from "react-native";
import { TableListItem } from './TableListItem/TableListItem'
import { ListEmptyComponent } from '../../components/ListEmptyComponent/ListEmptyComponent'

export const TableList = ({
    isLoading,
    listData,
    isParent,
    tableHeaders,
    onFetchMoreData,
    onFetchData,
    onPressRowItem,
}) => {
    const stopFetchMore = useRef(true);
    const handleFetch = () => {
        onFetchData();
    };

    const handleFetchMore = () => {
        if (!stopFetchMore.current) {
            onFetchMoreData();
            stopFetchMore.current = true;
        }
    };

    const onRowPress = (data) => {
        onPressRowItem(data);
    }

    const renderListItem = (item, index) => {
        const tableData = tableHeaders.map((key) => item[key.fieldName]);
        return (<TableListItem
            tableData={tableData}
            dataObj={item}
            index={index}
            tableHeaders={tableHeaders}
            isParent={isParent} onRowPress={(reportParam) => onRowPress(reportParam)} />)
    }
    return (
        <FlatList
            testID="reportsList"
            data={listData}
            renderItem={({ item, index }) => renderListItem(item, index)}
            keyExtractor={(item, index) => index}
            onEndReached={handleFetchMore}
            onEndReachedThreshold={0.5}
            refreshing={isLoading}
            onRefresh={handleFetch}
            onScroll={() => {
                stopFetchMore.current = false;
            }}
            ListEmptyComponent={
                < ListEmptyComponent
                    loadingStatus={false}
                    text="No data found"
                />
            }
        />
    );
}
