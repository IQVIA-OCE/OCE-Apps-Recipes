import { doesFieldExist, getIsAdvancedSearchEnabled } from '../api/commonApi';

export const getDbSearchFields = async (
  dbSearchFields,
  searchFields,
  tableName
) => {
  const isAdvancedSearchEnabled = await getIsAdvancedSearchEnabled();

  if (isAdvancedSearchEnabled) {

    const keys = Object.keys(searchFields);
    const promises = keys.map((k) =>
      doesFieldExist(searchFields[k], tableName)
    );

    const existFlags = await Promise.all(promises);

    keys.forEach((k, idx) => {
      const flag = existFlags[idx];
      if (flag) dbSearchFields.push(searchFields[k]);
    });
  }

  return dbSearchFields;
};
