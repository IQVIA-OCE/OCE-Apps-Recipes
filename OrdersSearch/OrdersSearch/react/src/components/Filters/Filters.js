import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Search, Select, Divider, Button } from "@oce-apps/apollo-react-native";
import { DatePicker } from "./DatePicker";
import { useDispatch, useSelector } from "react-redux";
import {
  brandsOptionsSelector,
  filtersSelector,
  statusDeliveryPicklistValuesSelector,
  statusOrderPicklistValuesSelector,
} from "../../store/filters/filtersSelector";
import { clearFilters, setFilter } from "../../store/filters/filtersSlice";
import {
  BRANDS,
  DELIVERY_END_DATE,
  DELIVERY_START_DATE,
  DELIVERY_STATUS,
  ORDER_END_DATE,
  ORDER_NAME,
  ORDER_START_DATE,
  ORDER_STATUS,
  PRODUCT_NAME,
} from "../../utils/constants";
import { arraysDiff } from "../../utils";
import { fetchOrdersList } from "../../store/orders/ordersSlice";

export const Filters = () => {

  const {
    orderName,
    productName,
    orderStartDate,
    orderEndDate,
    deliveryStartDate,
    deliveryEndDate,
    orderStatus,
    deliveryStatus,
    brands,
  } = useSelector(filtersSelector);

  const statusOrderOptions = useSelector(statusOrderPicklistValuesSelector);
  const statusDeliveryOptions = useSelector(statusDeliveryPicklistValuesSelector);

  const brandsOptions = useSelector(brandsOptionsSelector);

  const dispatch = useDispatch();

  const [
    {
      orderStartVisibility,
      orderEndVisibility,
      deliveryStartVisibility,
      deliveryEndVisibility,
    },
    setDatePickerVisibility,
  ] = useState({});

  const selectMultiple = (key, currentValue, val) => {
    const selectedItems = arraysDiff(currentValue, [val]);
    dispatch(setFilter({ key, value: selectedItems }));
  };

  const handleApplyFilters = () => {
    dispatch(fetchOrdersList());
  };
  
  return (
    <View style={styles.container}>
      <Divider style={{ marginTop: 20 }} />
      <View style={styles.row}>
        <View style={styles.rowItem}>
          <Search
            placeholder="Order name"
            value={orderName}
            onChangeText={(value) =>
              dispatch(setFilter({ key: ORDER_NAME, value }))
            }
            onIconPress={() =>
              dispatch(setFilter({ key: ORDER_NAME, value: "" }))
            }
            testID="orderNameSearch"
          />
        </View>
        <View style={styles.rowItem}>
          <Search
            placeholder="Product name"
            value={productName}
            onChangeText={(value) =>
              dispatch(setFilter({ key: PRODUCT_NAME, value }))
            }
            onIconPress={() =>
              dispatch(setFilter({ key: PRODUCT_NAME, value: "" }))
            }
            testID="productNameSearch"
          />
        </View>
        <View style={styles.rowItem}>
          <DatePicker
            placeholder="Order start date"
            date={orderStartDate}
            isVisible={orderStartVisibility}
            setDatePickerVisibility={setDatePickerVisibility}
            done={(value) => {
              dispatch(setFilter({ key: ORDER_START_DATE, value }));
            }}
            type={"orderStart"}
            maximumDate={orderEndDate}
            testID="orderStartPicker"
          />
        </View>
        <View style={styles.rowItem}>
          <DatePicker
            placeholder="Order end date"
            date={orderEndDate}
            isVisible={orderEndVisibility}
            setDatePickerVisibility={setDatePickerVisibility}
            done={(value) =>
              dispatch(setFilter({ key: ORDER_END_DATE, value }))
            }
            type={"orderEnd"}
            minimumDate={orderStartDate}
            testID="orderEndPicker"
          />
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.rowItem}>
          <DatePicker
            placeholder="Delivery start date"
            date={deliveryStartDate}
            isVisible={deliveryStartVisibility}
            setDatePickerVisibility={setDatePickerVisibility}
            done={(value) =>
              dispatch(setFilter({ key: DELIVERY_START_DATE, value }))
            }
            type={"deliveryStart"}
            maximumDate={deliveryEndDate}
            testID="deliveryStartPicker"
          />
        </View>
        <View style={styles.rowItem}>
          <DatePicker
            placeholder="Delivery end date"
            date={deliveryEndDate}
            isVisible={deliveryEndVisibility}
            setDatePickerVisibility={setDatePickerVisibility}
            done={(value) =>
              dispatch(setFilter({ key: DELIVERY_END_DATE, value }))
            }
            type={"deliveryEnd"}
            minimumDate={deliveryStartDate}
            testID="deliveryEndPicker"
          />
        </View>
        <View style={styles.rowItem}>
          <Select
            multiple
            value={orderStatus}
            fullWidth
            options={statusOrderOptions}
            onChange={(value) =>
              selectMultiple(ORDER_STATUS, orderStatus, value)
            }
            canDeselect={false}
            placeholder="Select order status"
            testID="orderStatusSelect"
          />
        </View>
        <View style={styles.rowItem}>
          <Select
            multiple
            value={deliveryStatus}
            fullWidth
            options={statusDeliveryOptions}
            onChange={(value) =>
              selectMultiple(DELIVERY_STATUS, deliveryStatus, value)
            }
            canDeselect={false}
            placeholder="Select delivery status"
            testID="deliveryStatusSelect"
          />
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.rowItem}>
          <Select
            multiple
            value={brands}
            fullWidth
            options={brandsOptions}
            onChange={(value) => selectMultiple(BRANDS, brands, value)}
            canDeselect={false}
            placeholder="Select brands"
            testID="brandsSelect"
          />
        </View>
      </View>
      <View style={[styles.row, { justifyContent: "flex-start" }]}>
        <Button mode="contained" onPress={handleApplyFilters} testID="applyButton">
          Apply
        </Button>
        <Button
          mode="outlined"
          style={{ marginLeft: 15 }}
          onPress={() => dispatch(clearFilters())}
          testID="clearButton"
        >
          Clear
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 20,
  },
  rowItem: {
    width: "22%",
  },
});
