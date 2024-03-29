import React from "react";
import { Text } from "@oce-apps/apollo-react-native";

const CustomHeaderCell = ({ title = "" }) => {  
  return <Text style={{ fontSize: 11 }}>{title}</Text>;
};

export default CustomHeaderCell;
