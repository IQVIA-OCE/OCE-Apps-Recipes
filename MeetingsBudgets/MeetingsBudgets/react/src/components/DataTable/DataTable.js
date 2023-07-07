import { useTheme } from 'apollo-react-native';
import React, { useEffect, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import ColumnTitle from './ColumnTitle';
import RowHeader from './RowHeader';
import RowPhone from './RowPhone';
import RowTablet from './RowTablet';
import color from 'color';

const DataTable = ({
  columns,
  rows,
  style,
  columnWidth = [],
  phoneSortedColumn = '',
  initialSortedColumn = columns[0].accessor,
  initialSortOrder = 'ascending',
  horizontalScroll = false,
  verticalRow = false,
  refreshing = false,
  onEndReachedThreshold = 0,
  listEmptyComponent = () => (
    <Text style={{ textAlign: 'center', padding: 15 }}>
      There is nothing to display
    </Text>
  ),
  onRefresh,
  onEndReached,
  onScrollBeginDrag,
  onRowPress,
}) => {
  const theme = useTheme();
  const [data, setData] = useState(rows);
  const [{ activeSortColumn, activeSortOrder }, setActiveSorting] = useState({
    activeSortColumn: initialSortedColumn,
    activeSortOrder: initialSortOrder,
  });

  useEffect(() => {
    onRowsChange();
  }, [rows]);

  const onRowsChange = () => {
    const column = columns.find(
      (col) => col.accessor === activeSortColumn
    );
    if (column.sortFunction) {
      const sortedData = rows
        .slice()
        .sort((a, b) =>
          column.sortFunction(activeSortColumn, activeSortOrder, a, b)
        );
      setData(sortedData);
    }
  };

  const handleSortingColumn = (index, sortOrder) => {
    const column = columns[index];
    if (column.sortFunction) {
      const newSortOrder =
        sortOrder === 'ascending' ? 'descending' : 'ascending';

      setActiveSorting({
        activeSortColumn: column.accessor,
        activeSortOrder: newSortOrder,
      });

      setData((prevData) =>
        prevData
          .slice()
          .sort((a, b) =>
            column.sortFunction(column.accessor, newSortOrder, a, b)
          )
      );
    }
  };

  const content = (
    <View
      style={[styles.container, style, {
        borderColor: theme.dark
          ? color(theme.colors.tertiary).darken(0.5).hex()
          : color(theme.colors.surface).darken(0.1).hex(),
      }]}
      testID={'dataTable-container'}
    >
      <FlatList
        data={data}
        ListHeaderComponent={() => (
          <RowHeader>
            {verticalRow && phoneSortedColumn ? (
              <ColumnTitle
                columnIndex={columns.findIndex(
                  (col) => col.accessor === phoneSortedColumn
                )}
                sortOrder={
                  activeSortColumn === phoneSortedColumn
                    ? activeSortOrder
                    : null
                }
                onSortColumn={handleSortingColumn}
                style={{ width: '100%' }}
              >
                {
                  columns.find((col) => col.accessor === phoneSortedColumn)
                    .header
                }
              </ColumnTitle>
            ) : (
              columns.map((column, index) => (
                <ColumnTitle
                  columnIndex={index}
                  sortOrder={
                    activeSortColumn === column.accessor
                      ? activeSortOrder
                      : null
                  }
                  onSortColumn={handleSortingColumn}
                  key={`column-title_${index}`}
                  style={{
                    width: columnWidth[index] || 'auto',
                  }}
                >
                  {column.header}
                </ColumnTitle>
              ))
            )}
          </RowHeader>
        )}
        renderItem={({ item, index }) =>
          verticalRow ? (
            <RowPhone
              item={item}
              phoneSortedColumn={phoneSortedColumn}
              columns={columns}
              onRowPress={onRowPress}
              testID={`rowPhone-${index}`}
            />
          ) : (
            <RowTablet
              item={item}
              columns={columns}
              columnWidth={columnWidth}
              onRowPress={onRowPress}
            />
          )
        }
        ListEmptyComponent={listEmptyComponent}
        keyExtractor={(item, index) => `${item.id}_${index}`}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReachedThreshold={onEndReachedThreshold}
        onEndReached={onEndReached}
        onScrollBeginDrag={onScrollBeginDrag}
        stickyHeaderIndices={[0]}
        style={styles.table}
      />
    </View>
  );

  return horizontalScroll ? (
    <ScrollView horizontal testID={'dataTable-horizontalScroll'}>
      {content}
    </ScrollView>
  ) : (
    content
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 4,
    borderWidth: 1,
  },
  table: {
    minWidth: '100%',
  },
});

export default DataTable;
