import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Table, Colors } from '@oce-apps/apollo-react-native';
import ActionCell from './ActionCell';
import TitleCell from './TitleCell';
import QuantityCell from './QuantityCell';
import CommentsCell from './CommentsCell';
import ReasonCell from './ReasonCell';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const TransactionTable = ({ rows, removeRow, readonly, ...rest }) => {
  const columns = {
    name: {
      header: 'PRODUCT',
      accessor: 'name',
      customCell: TitleCell,
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
      customCell: props => (
        <QuantityCell readonly={readonly} {...props} {...rest} />
      ),
    },
    reason: {
      header: 'REASON',
      accessor: 'reason',
      sortFunction: null,
      filterFunction: null,
      filterComponent: null,
      customCell: props => <ReasonCell readonly={readonly} {...props} {...rest} />,
    },
    comments: {
      header: 'COMMENTS',
      accessor: 'comments',
      sortFunction: null,
      filterFunction: null,
      filterComponent: null,
      customCell: props => (
        <CommentsCell readonly={readonly} {...props} {...rest} />
      ),
    },
    action: {
      accessor: 'action',
      customCell: props =>
        readonly ? null : <ActionCell {...props} onPress={removeRow} />,
    },
  };

  const getTableColumns = () => {
    const recordTypeDevName = rest.form.values.recordType.DeveloperName;

    switch (recordTypeDevName) {
      case 'Adjustment':
        return getTableColumnsByNames([
          'name',
          'quantity',
          'reason',
          'comments',
          'action',
        ]);
      default:
        return getTableColumnsByNames([
          'name',
          'quantity',
          'comments',
          'action',
        ]);
    }
  };

  const getTableColumnWidth = () => {
    const recordTypeDevName = rest.form.values.recordType.DeveloperName;

    switch (recordTypeDevName) {
      case 'Adjustment':
        return [200, 150, 150, 'auto', 50];
      default:
        return [300, 200, 'auto', 50];
    }
  };

  const getTableColumnsByNames = columnsNames => {
    return [...columnsNames.map(name => columns[name])];
  };

  return (
    <View style={styles.root} testID="TransactionTable">
      <KeyboardAwareScrollView
        automaticallyAdjustContentInsets={false}
        keyboardShouldPersistTaps="always"
        scrollEventThrottle={10}
        extraHeight={-500}
        extraScrollHeight={-500}
        contentContainerStyle={{ flexGrow: 1 }}
        enableAutomaticScroll={true}
        nestedScrollEnabled={true}
      >
        <Table
          style={styles.table}
          columnWidth={getTableColumnWidth()}
          columns={getTableColumns()}
          rows={rows}
          hidePagination
        />
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexGrow: 1,
    flexBasis: 0,
    height: '100%',
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

export default TransactionTable;
