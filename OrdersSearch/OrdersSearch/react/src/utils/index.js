import { sfNetAPI, metadataBridge, environment } from '@oce-apps/oce-apps-bridges';
import { Platform } from "react-native";
import { PAGE_TYPE } from "./constants";
import { DateTime } from "luxon";

export const isIphone =
  typeof Platform.isPad === "undefined" ? false : !Platform.isPad;

export const isWeb = Platform.OS === "web";

export const arraysDiff = (arr1, arr2) => {
  const filteredArr1 = arr1.filter(
    (obj) => !arr2.some((obj2) => obj.value == obj2.value)
  );
  const filteredArr2 = arr2.filter(
    (obj) => !arr1.some((obj2) => obj.value == obj2.value)
  );
  return filteredArr1.concat(filteredArr2);
};

export const countFilledValues = (obj) => {
  let count = 0;
  Object.keys(obj).forEach((key) => {
    if (obj[key].length) count++;
  });
  return count;
};

export const definePageType = async (id) => {
  try {
    let accountKeyPrefix;
    if (Platform.OS === "web") {
      const result = await sfNetAPI.metadata(`Account`);
      accountKeyPrefix = result.objectDescribe.keyPrefix
    } else {
      const result = await metadataBridge.describe(`Account`);
      accountKeyPrefix = result.keyPrefix;
    }
    if (id.startsWith(accountKeyPrefix)) {
      return PAGE_TYPE.ACCOUNT;
    } else {
      return PAGE_TYPE.ORDER;
    }
  } catch (error) {
    return Promise.reject({
      ...error,
      message: `Get metadata for Account. ${error.message}`
    });
  }
};

export const sortStrings = (accessor, sortOrder, a,b) => {
  if (sortOrder === 'ascending'){
    return (a[accessor] > b[accessor]) ? 1 : ((b[accessor] > a[accessor]) ? -1 : 0)
  } else {
    return (a[accessor] < b[accessor]) ? 1 : ((b[accessor] < a[accessor]) ? -1 : 0)
  }
};

export const sortDates = (accessor, sortOrder, a,b) => {
  if (sortOrder === 'ascending'){
    return new Date(a[accessor]) - new Date(b[accessor])
  } else {
    return new Date(b[accessor]) - new Date(a[accessor])
  }
};

export const mappingBrands = (brands = []) => {
  return brands.map(item => {
    return {
      label: item.Name,
      value: item.Id
    }
  })
}

const userLocale = environment.locale().replace('_', '-');

export const formatDate = (date) => {
  return DateTime.fromISO(date).toLocaleString(DateTime.DATE_SHORT, { locale: userLocale }).replace(/\./g, '/');
}
