import React, { useContext } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Table, secondaryBlue } from 'apollo-react-native';
import ActionCell from './ActionCell';
import TitleCell from './TitleCell';
import CountCell from './CountCell';
import ReasonCell from './ReasonCell';
import { InventoryContext } from '../InventoryContext';
import { useFormikContext } from 'formik';
import HistoryCell from './HistoryCell';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {INVENTORY_FORM_TYPE} from "../../../constants/Inventories";

const InventoryTable = ({ removeRow, showProductHistory }) => {
  const { values } = useFormikContext();
  const {
    editingType,
    config: { showCalculatedFields, showSystemCount, historyHidden },
  } = useContext(InventoryContext);
  const getTableConfig = ({
    showCalculatedFields,
    showSystemCount,
    historyHidden,
  }) => {
    const title = {
      header: 'PRODUCT',
      accessor: 'name',
      customCell: TitleCell,
      sortFunction: null,
      filterFunction: null,
      filterComponent: null,
    };
    const reason = {
      header: 'REASON',
      customCell: props => <ReasonCell {...props} />,
      sortFunction: null,
      filterFunction: null,
      filterComponent: null,
    };
    const openingBalance = {
      header: 'OPENING BALANCE',
      accessor: 'openingBalance',
      sortFunction: null,
      filterFunction: null,
      filterComponent: null,
    };
    const physicalCount = {
      header: 'PHYSICAL COUNT',
      customCell: props => <CountCell {...props} />,
      sortFunction: null,
      filterFunction: null,
      filterComponent: null,
    };
    const systemCount = [
      {
        header: 'QTY. IN',
        accessor: 'quantityIn',
        sortFunction: null,
        filterFunction: null,
        filterComponent: null,
      },
      {
        header: 'QTY. OUT',
        accessor: 'quantityOut',
        sortFunction: null,
        filterFunction: null,
        filterComponent: null,
      },
      {
        header: 'SYS. COUNT',
        accessor: 'systemCount',
        sortFunction: null,
        filterFunction: null,
        filterComponent: null,
      },
    ];
    const actions = {
      accessor: 'action',
      customCell: props => <ActionCell {...props} onPress={removeRow} />,
    };
    const historyActions = {
      accessor: 'historyAction',
      customCell: props => (
        <HistoryCell {...props} onPress={showProductHistory} />
      ),
    };
    let tableConfig = {
      columns: [title, physicalCount, actions],
      columnsSize: ['auto', 150, 50],
    };

    if (editingType === INVENTORY_FORM_TYPE.preview) {
      return {
        columns: [title, physicalCount, reason, actions],
        columnsSize: ['auto', 150, 130, 50],
      }
    }

    if (showCalculatedFields) {
      tableConfig = {
        columns: [title, openingBalance, physicalCount, reason, actions],
        columnsSize: ['auto', 150, 150, 130, 50],
      };
    }

    if (showSystemCount) {
      tableConfig = {
        columns: [title, ...systemCount, physicalCount, actions],
        columnsSize: ['auto', 70, 70, 80, 150, 50],
      };
    }
    if (showCalculatedFields && showSystemCount) {
      tableConfig = {
        columns: [
          title,
          openingBalance,
          ...systemCount,
          physicalCount,
          reason,
          actions,
        ],
        columnsSize: ['auto', 65, 65, 65, 65, 100, 130, 40],
      };
    }

    if (!Boolean(historyHidden)) {
      tableConfig = {
        columns: [historyActions, ...tableConfig.columns],
        columnsSize: [50, ...tableConfig.columnsSize],
      };
    }

    return tableConfig;
  };

  const config = getTableConfig({
    showCalculatedFields,
    showSystemCount,
    historyHidden,
  });
  return (
    <View style={styles.root}>
      <KeyboardAwareScrollView
        automaticallyAdjustContentInsets={false}
        keyboardShouldPersistTaps="always"
        scrollEventThrottle={10}
        extraHeight={-500}
        extraScrollHeight={-500}
        contentContainerStyle={{ flexGrow: 1 }}
        enableAutomaticScroll={true}
      >
        <Table
          style={styles.table}
          columnWidth={config.columnsSize}
          columns={config.columns}
          rows={values.products}
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

export default InventoryTable;
