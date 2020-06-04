export const normalizeInventories = recordTypesData => inventoriesData => {
  const data = {
    inventories: {
      all: [],
    },
    recordTypes: {
      all: [],
    },
  };
  if (
    recordTypesData &&
    recordTypesData.length &&
    inventoriesData &&
    inventoriesData.length
  ) {
    const inventories = inventoriesData.reduce((acc, item) => {
      const type = recordTypesData.find(
        type => item.RecordTypeId === type.Id
      );
      if (!acc[type.DeveloperName]) {
        acc[type.DeveloperName] = [];
      }
      item.DeveloperName = type.DeveloperName;
      acc[type.DeveloperName].push(item);
      return acc;
    }, {});
    inventories.all = inventoriesData;
    data.inventories = inventories;

    const recordTypes = recordTypesData.reduce((acc, item) => {
      acc[item.DeveloperName] = item;
      return acc;
    }, {});

    recordTypes.all = recordTypesData;
    data.recordTypes = recordTypes;

    return data;
  }

  return data;
};