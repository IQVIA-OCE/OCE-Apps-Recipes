import React from "react";
import { Banner } from "@oce-apps/apollo-react-native";
import { useSelector } from "react-redux";
import { errorSelector } from "../store/orders/ordersSelector";
import { errorFiltersSelector } from "../store/filters/filtersSelector";

const Error = () => {
  const orderError = useSelector(errorSelector);
  const filterError = useSelector(errorFiltersSelector);
  return (
    <Banner
      variant="error"
      visible={orderError || filterError}
      style={{ marginBottom: 15 }}
      icon={"alert-circle"}
    >
      {orderError && orderError.message}
      {filterError && filterError.message}
    </Banner>
  );
};

export default Error;
