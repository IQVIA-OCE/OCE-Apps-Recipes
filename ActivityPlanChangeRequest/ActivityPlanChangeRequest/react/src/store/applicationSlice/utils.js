export const getPicklistValues = (described) => {
  const obj = {};

  described.fields.forEach((field) => {
    if (field.picklistValues) {
      obj[field.name] = field.picklistValues.map(
        (valueObject) => valueObject.value
      );
    }
  });

  return obj;
};

export const getAccountsValues = (list) => {
  return list.map((account) => ({
    label: account.Name,
    value: account.Id,
  }));
};
