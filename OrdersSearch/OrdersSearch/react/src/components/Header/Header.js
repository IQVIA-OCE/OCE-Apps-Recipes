import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { ApolloProgress, Text } from "@oce-apps/apollo-react-native";
import { FiltersToggleButton } from "./FiltersToggleButton";
import { Filters } from "../Filters/Filters";
import { useDispatch, useSelector } from "react-redux";
import { filtersCountSelector } from "../../store/filters/filtersSelector";
import { fetchBrandsList, fetchDeliveryPickList, fetchOrderPickList } from "../../store/filters/filtersSlice";
import {
  accountNameLoadingSelector,
  accountNameSelector,
  pageTypeSelector,
} from "../../store/orders/ordersSelector";
import AccountsFilter from "./AccountsFilter";
import { LOADING_STATUS, PAGE_TYPE } from "../../utils/constants";

const Header = () => {
  const [isExpanded, setExpanded] = useState(false);
  const filterCount = useSelector(filtersCountSelector);
  const accountName = useSelector(accountNameSelector);
  const accountNameLoading = useSelector(accountNameLoadingSelector);
  const pageType = useSelector(pageTypeSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchOrderPickList());
    dispatch(fetchDeliveryPickList());
    dispatch(fetchBrandsList());
  }, []);

  const isAccountNameVisible = pageType === PAGE_TYPE.ACCOUNT || pageType === PAGE_TYPE.ORDER;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search for Orders</Text>
        <View style={styles.filtersWrapper}>
          {isAccountNameVisible && (
            <>
              {accountNameLoading === LOADING_STATUS.PENDING && (
                <ApolloProgress />
              )}
              {accountNameLoading === LOADING_STATUS.SUCCESS && (
                <>{accountName && <Text>{accountName}</Text>}</>
              )}
            </>
          )}
          {pageType === PAGE_TYPE.HOME && (
            <View style={styles.searchBarWrapper} testID="accountFilterWrapper">
              <AccountsFilter />
            </View>
          )}
          <TouchableWithoutFeedback
            testID={"accordionTouchable"}
            onPress={() => setExpanded(!isExpanded)}
          >
            <View>
              <FiltersToggleButton
                title={"Filters"}
                expanded={!isExpanded}
                filterCount={filterCount}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
      {isExpanded && <Filters />}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
  },
  filtersWrapper: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
  },
  searchBar: {
    width: 200,
  },
  searchBarWrapper: {
    paddingLeft: 20,
  },
});

export default Header;
