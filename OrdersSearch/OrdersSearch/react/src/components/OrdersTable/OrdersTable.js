import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ApolloProgress, Table, useTheme, Text } from "@oce-apps/apollo-react-native";
import { fetchOrdersList } from "../../store/orders/ordersSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  accountIdSelector,
  accountNameLoadingSelector,
  pageTypeSelector,
  ordersListLoadingSelector,
  ordersListSelector,
  recordIdSelector,
} from "../../store/orders/ordersSelector";
import { LOADING_STATUS, PAGE_TYPE } from "../../utils/constants";
import { formatDate, sortDates, sortStrings } from "../../utils";
import CustomCellOrder from "./CustomCellOrder";
import CustomCellAccount from "./CustomCellAccount";
import { environment } from "@oce-apps/oce-apps-bridges";
import { DateTime } from "luxon";
import CustomHeaderCell from "./CustomHeaderCell";

const NAMESPACE = environment.namespace();

export const OrdersTable = () => {
  const theme = useTheme();

  const dispatch = useDispatch();
  const ordersList = useSelector(ordersListSelector);
  const accountNameLoading = useSelector(accountNameLoadingSelector);
  const recordId = useSelector(recordIdSelector);
  const accountId = useSelector(accountIdSelector);
  const pageType = useSelector(pageTypeSelector);
  const ordersLoadingStatus = useSelector(ordersListLoadingSelector);

  const [
    {
      asyncRows,
      asyncSize,
      asyncPage,
      asyncRowsPerPage,
      asyncSortedColumn,
      asyncSortOrder,
    },
    setState,
  ] = useState({
    isLoading: true,
    asyncRows: [],
    asyncSize: 0,
    asyncPage: 1,
    asyncRowsPerPage: 5,
    asyncSortedColumn: "name",
    asyncSortOrder: "ascending",
  });

  useEffect(() => {
    if (accountId && accountNameLoading === LOADING_STATUS.SUCCESS) {
      dispatch(fetchOrdersList(accountId));
    }
  }, [accountId, accountNameLoading]);

  useEffect(() => {
    if (pageType === PAGE_TYPE.HOME) {
      dispatch(fetchOrdersList(recordId));
    }
  }, [recordId, pageType]);

  useEffect(() => {
    onChangeHandler(1, asyncRowsPerPage, asyncSortedColumn, asyncSortOrder);
  }, [ordersList]);

  const columnsDefault = [
    {
      header: <CustomHeaderCell title="Order name" />,
      accessor: "Order_Name",
      sortFunction: sortStrings,
      customCell: ({ row }) => {
        if (row.Id.startsWith(NAMESPACE.toLowerCase()) && !row.Order_Name) {
          return <CustomCellOrder title='O-0009*' id={row.Id} />
        }
        return <CustomCellOrder title={row.Order_Name} id={row.Id} />
      },
    },
    {
      header: <CustomHeaderCell title="Order date" />,
      accessor: "Order_Date",
      sortFunction: sortDates,
      customCell: ({ row }) => {
        if (!row.Order_Date) return null;
        const dt = formatDate(row.Order_Date);
        return <Text>{dt}</Text>;
      },
    },
    {
      header: <CustomHeaderCell title="Price list name" />,
      accessor: "Price_List_Name",
      sortFunction: sortStrings,
    },
    {
      header: <CustomHeaderCell title="Net amount" />,
      accessor: "Net_Amount",
      sortFunction: sortStrings,
      customCell: ({ row }) => {
        const formattedNum = (
          Math.round(((row.Net_Amount || 0) + Number.EPSILON) * 100) / 100
        ).toFixed(2);
        return <Text>{formattedNum}</Text>;
      },
    },
    {
      header: <CustomHeaderCell title="Order quantity" />,
      accessor: "Order_Quantity",
      sortFunction: sortStrings,
    },
    {
      header: <CustomHeaderCell title="Order status" />,
      accessor: "Order_Status",
      sortFunction: sortStrings,
    },
  ];

  if (pageType === PAGE_TYPE.HOME) {
    columnsDefault.splice(1, 0, {
      header: <CustomHeaderCell title="Order account name" />,
      accessor: "Order_Account_Name",
      sortFunction: sortStrings,
      customCell: ({ row }) => (
        <CustomCellAccount
          title={row.Order_Account_Name}
          id={row[`${NAMESPACE}Account__c`]}
        />
      ),
    });
  }

  const onChangeHandler = (
    page = 1,
    rowsPerPage,
    sortedColumn,
    sortOrder,
    filters
  ) => {
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));

    const { displayRows, dataSize } = getRows(
      page,
      rowsPerPage,
      sortedColumn,
      sortOrder
    );
    setState((prevState) => ({
      ...prevState,
      asyncRows: displayRows,
      asyncSize: dataSize,
      asyncPage: page,
      asyncRowsPerPage: rowsPerPage,
      asyncSortedColumn: sortedColumn,
      asyncSortOrder: sortOrder,
      isLoading: false,
    }));
  };

  const getRows = (
    page,
    rowsPerPage,
    sortedColumn,
    sortOrder = "ascending",
  ) => {
    let displayRows = [...ordersList];

    const dataSize = displayRows.length;

    if (dataSize > 1) {
      let sortedColumnObj = columnsDefault.find(
        (c) => c.accessor === sortedColumn
      );
      let sortFunction =
        sortedColumnObj && sortedColumnObj.sortFunction
          ? sortedColumnObj.sortFunction
          : null;

      displayRows = sortFunction
        ? displayRows.sort((a, b) =>
            sortFunction ? sortFunction(sortedColumn, sortOrder, a, b) : null
          )
        : displayRows;
      const firstRow = page ? (page - 1) * rowsPerPage : 0;
      const lastRow = firstRow + rowsPerPage;

      displayRows = displayRows.slice(firstRow, lastRow);
    }

    return {
      displayRows: displayRows ? displayRows : [],
      dataSize,
    };
  };

  return (
    <View style={styles.container}>
      <Table
        title="Orders"
        columns={columnsDefault}
        rows={asyncRows}
        size={asyncSize}
        page={asyncPage}
        rowsPerPage={asyncRowsPerPage}
        sortedColumn={asyncSortedColumn}
        sortOrder={asyncSortOrder}
        rowsPerPageOptions={[5, 10, 50]}
        onChange={onChangeHandler}
        CustomHeader={() => null}
        testID="ordersTable"
        isLoading={
          ordersLoadingStatus === LOADING_STATUS.IDLE ||
          ordersLoadingStatus === LOADING_STATUS.PENDING
        }
        inlinePagination
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    marginBottom: 30,
    position: "relative",
  },
  loadingScreen: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0.8,
  },
});
