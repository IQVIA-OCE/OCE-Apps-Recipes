import { Text, useTheme } from "apollo-react-native";
import { navigator } from "oce-apps-bridges";
import React from "react";
import { TouchableWithoutFeedback } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { pageTypeSelector } from "../../store/orders/ordersSelector";
import { setError } from "../../store/orders/ordersSlice";
import { PAGE_TYPE } from "../../utils/constants";

const CustomCellAccount = ({ title = '', id }) => {
  const theme = useTheme();
const  dispatch  = useDispatch();
    const pageType = useSelector(pageTypeSelector);
    const handleOpenAccount = async () => {
        try {
          await navigator.navigate({}, `Account`, id, "present", "view");
        } catch (error) {
          dispatch(setError(new Error(error)))
          console.log("Opening order error", error);
        }
      };
  if (pageType === PAGE_TYPE.HOME) {
    return (
      <TouchableWithoutFeedback onPress={handleOpenAccount} testID="touchableCell">
        <Text style={{ color: theme.colors.primary }}>{title}</Text>
      </TouchableWithoutFeedback>
    );
  } 
  return <Text testID="textCell">{title}</Text>;
};

export default CustomCellAccount;
