import React, { useEffect } from "react";
import { ScrollView, useColorScheme, Platform } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, Provider as ReduxProvider } from "react-redux";
import { fetchAccountIdByOrderId } from "./src/api/ordersApi";
import Header from "./src/components/Header/Header";
import { OrdersTable } from "./src/components/OrdersTable/OrdersTable";
import { environment, layoutBridge, sfNetAPI } from "@oce-apps/oce-apps-bridges";
import {
  fetchAccountName,
  setAccountId,
  setError,
  setPageType,
} from "./src/store/orders/ordersSlice";
import { definePageType } from "./src/utils";
import { PAGE_TYPE } from "./src/utils/constants";
import store from './src/store/index';
import { Provider as ApolloProvider, DarkTheme, DefaultTheme, useTheme } from '@oce-apps/apollo-react-native';
import Error from "./src/components/Error";

console.reportErrorsAsExceptions = false;
sfNetAPI.enablePromises();

Icon.loadFont();
const NAMESPACE = environment.namespace();

const App = ({ recordId }) => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const configAccount = async (recordId) => {
    try {
      const pageType = await definePageType(recordId);
      dispatch(setPageType(pageType));
      if (pageType === PAGE_TYPE.ORDER) {
        const { records } = await fetchAccountIdByOrderId(recordId);
        const accountId = records[0][`${NAMESPACE}Account__c`];
        dispatch(setAccountId(accountId));
        dispatch(fetchAccountName(accountId));
      } else {
        dispatch(setAccountId(recordId));
        dispatch(fetchAccountName(recordId));
      }
    } catch (error) {
      dispatch(setError(error))
      console.log('Config account error', error);
    }
  };

  useEffect(() => {
    console.log(recordId, "recordId");
    if (recordId) {
      configAccount(recordId);
    } else {
      dispatch(setPageType(PAGE_TYPE.HOME));
    }
  }, [recordId]);

  return (
    <>
      <ScrollView style={{ padding: 20, paddingBottom: 20, backgroundColor: theme.colors.surface }}>
        <Error/>
        <Header />
        <OrdersTable />
      </ScrollView>
    </>
  );
};


const Root = (initialProps) => {
  const { instanceId, recordId } = initialProps;
  let preferredTheme = DefaultTheme;

  if (Platform.OS !== 'web') {
      const colorScheme = useColorScheme();
      preferredTheme = colorScheme === "dark" ? DarkTheme : DefaultTheme;
  }
  if (instanceId) {
   layoutBridge.setHeight(500);
  }

  return (
    <ReduxProvider store={store}>
      <ApolloProvider theme={preferredTheme}>
        <App recordId={recordId}/>
      </ApolloProvider>
    </ReduxProvider>
  );
};

export default Root;
