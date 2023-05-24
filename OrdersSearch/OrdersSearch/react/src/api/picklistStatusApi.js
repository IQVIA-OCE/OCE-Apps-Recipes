
import { sfNetAPI, environment, metadataBridge } from "oce-apps-bridges";
import { Platform } from "react-native";

const NAMESPACE = environment.namespace();

export const fetchOrderPickListValues = async () => {
    try {
      let result;
      if (Platform.OS === "web") {
        result = await sfNetAPI.describe(`${NAMESPACE}Order2__c`);
      } else {
        result = await metadataBridge.describe(`${NAMESPACE}Order2__c`);
      }
      const values = result.fields.find(
        (item) => item.name === `${NAMESPACE}Status__c`
      );
      return values.picklistValues;
    } catch (error) {
      return error;
    }
};

export const fetchDeliveryPickListValues = async () => {
  try {
    let result;
    if (Platform.OS === "web") {
      result = await sfNetAPI.describe(`${NAMESPACE}OrderDelivery2__c`);
    } else {
      result = await metadataBridge.describe(`${NAMESPACE}OrderDelivery2__c`);
    }
    const values = result.fields.find(
      (item) => item.name === `${NAMESPACE}Status__c`
    );
    return values.picklistValues;
  } catch (error) {
    return error;
  }
};