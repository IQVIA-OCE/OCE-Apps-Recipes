import { Text, useTheme } from "@oce-apps/apollo-react-native";
import { navigator, environment } from "@oce-apps/oce-apps-bridges";
import React from "react";
import { TouchableWithoutFeedback } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { pageTypeSelector } from "../../store/orders/ordersSelector";
import { setError } from "../../store/orders/ordersSlice";
import { PAGE_TYPE } from "../../utils/constants";

const NAMESPACE = environment.namespace();

const CustomCellOrder = ({ title = "", id }) => {  
  const theme = useTheme();

  const pageType = useSelector(pageTypeSelector);
  const dispatch = useDispatch();

  const handleOpenOrder = async () => {
    try {
      await navigator.navigate(
        {},
        `${NAMESPACE}OrderDelivery2__c`,
        id,
        "present",
        "view"
      );
    } catch (error) {
      dispatch(setError(new Error(error)));
      console.log("Opening order error", error);
    }
  };
  if (pageType === PAGE_TYPE.ACCOUNT || pageType === PAGE_TYPE.HOME) {
    return (
      <TouchableWithoutFeedback onPress={handleOpenOrder} testID="touchableCell">
        <Text style={{ color: theme.colors.primary }}>{title}</Text>
      </TouchableWithoutFeedback>
    );
  }
  return <Text testID="textCell">{title}</Text>;
};

export default CustomCellOrder;
