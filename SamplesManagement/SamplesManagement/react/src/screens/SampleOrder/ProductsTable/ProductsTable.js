import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Table, Colors } from 'apollo-react-native';
import ActionCell from './ActionCell';
import TitleCell from './TitleCell';
import QuantityCell from './QuantityCell';
import CommentsCell from './CommentsCell';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const ProductsTable = ({
  rows,
  removeRow,
  showProductAllocationRemaining,
  ...rest
}) => {
  const columns = {
    name: {
      header: 'PRODUCT',
      accessor: 'name',
      customCell: TitleCell,
      sortFunction: null,
      filterFunction: null,
      filterComponent: null,
    },
    remainingAllocation: {
      header: 'REMAINING ALLOCATION',
      accessor: 'remainingAllocation',
      sortFunction: null,
      filterFunction: null,
      filterComponent: null,
    },
    quantity: {
      header: 'QUANTITY',
      accessor: 'quantity',
      sortFunction: null,
      filterFunction: null,
      filterComponent: null,
      customCell: props => <QuantityCell {...props} {...rest} />,
    },
    comments: {
      header: 'COMMENTS',
      accessor: 'comments',
      sortFunction: null,
      filterFunction: null,
      filterComponent: null,
      customCell: props => <CommentsCell {...props} {...rest} />,
    },
    action: {
      accessor: 'action',
      customCell: props => <ActionCell {...props} onPress={removeRow} />,
    },
  };

  const getTableColumns = () => {
    if (showProductAllocationRemaining == true) {
      return getTableColumnsByNames([
        'name',
        'remainingAllocation',
        'quantity',
        'comments',
        'action',
      ]);
    } else {
      return getTableColumnsByNames(['name', 'quantity', 'comments', 'action']);
    }
  };

  const getTableColumnWidth = () => {
    if (showProductAllocationRemaining == true) {
      return [200, 180, 130, 'auto', 50];
    } else {
      return [300, 200, 'auto', 50];
    }
  };

  const getTableColumnsByNames = columnsNames => {
    return [...columnsNames.map(name => columns[name])];
  };

  return (
    <View style={{ height: 300 }}>
      <KeyboardAwareScrollView
        automaticallyAdjustContentInsets={false}
        keyboardShouldPersistTaps="always"
        scrollEventThrottle={10}
        extraHeight={-500}
        extraScrollHeight={-500}
        contentContainerStyle={{ flexGrow: 1 }}
        enableAutomaticScroll={true}
      >
        <View style={{ flex: 1 }}>
          <Table
            style={styles.table}
            columnWidth={getTableColumnWidth()}
            columns={getTableColumns()}
            rows={rows}
            hidePagination
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexGrow: 1,
    flexBasis: 0,
  },
  table: {
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
});

export default ProductsTable;
