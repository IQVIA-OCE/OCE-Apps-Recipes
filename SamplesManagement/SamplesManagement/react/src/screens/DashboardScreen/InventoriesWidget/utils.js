import moment from 'moment';
import { INVENTORY_STATUS } from '../../InventoryScreen/constants';
import { INVENTORY_FORM_TYPE } from '../../../constants/Inventories';
import { INVENTORY_TYPE } from './constants';
import { NAMESPACE } from '../../../constants/constants';

export const normalizeInventories = recordTypesData => inventoriesData => {
  let data = {
    all: [],
  };
  if (
    recordTypesData &&
    recordTypesData.length &&
    inventoriesData &&
    inventoriesData.length
  ) {
    data = inventoriesData.reduce((acc, item) => {
      const type = recordTypesData.find(type => item.RecordTypeId === type.Id);
      if (!acc[type.DeveloperName]) {
        acc[type.DeveloperName] = [];
      }
      item.DeveloperName = type.DeveloperName;
      acc[type.DeveloperName].push(item);
      return acc;
    }, {});
    data.all = inventoriesData;
  }

  return data;
};

export const normalizeRecordTypes = recordTypesData => {
  let data = {
    all: [],
  };
  if (recordTypesData && recordTypesData.length) {
    data = recordTypesData.reduce((acc, item) => {
      acc[item.DeveloperName] = item;
      return acc;
    }, {});
    data.all = recordTypesData;
  }

  return data;
};

export const getMenuItems = (navigation, { inventories, recordTypes }) => {
  if (
    inventories &&
    inventories.InitialInventory &&
    inventories.InitialInventory.length
  ) {
    const item = inventories.InitialInventory.find(
      el => el[`${NAMESPACE}Status__c`] !== INVENTORY_STATUS.submitted
    );
    if (item) {
      return [
        {
          text: INVENTORY_TYPE[item.DeveloperName],
          onPress: () =>
            navigation.navigate('Inventory', {
              id: item.Id,
              type:
                item[`${NAMESPACE}Status__c`] === INVENTORY_STATUS.inProgress
                  ? INVENTORY_FORM_TYPE.edit
                  : INVENTORY_FORM_TYPE.editSaved,
            }),
        },
      ];
    } else {
      return [
        {
          text: INVENTORY_TYPE.AdHocInventory,
          onPress: () =>
            navigation.navigate('Inventory', {
              recordType: recordTypes.AdHocInventory,
            }),
        },
        {
          text: INVENTORY_TYPE.AuditedInventory,
          onPress: () =>
            navigation.navigate('Inventory', {
              recordType: recordTypes.AuditedInventory,
            }),
        },
        {
          text: INVENTORY_TYPE.PeriodicInventory,
          onPress: () =>
            navigation.navigate('Inventory', {
              recordType: recordTypes.PeriodicInventory,
            }),
        },
      ];
    }
  }
  return [
    {
      text: INVENTORY_TYPE.InitialInventory,
      onPress: () =>
        navigation.navigate('Inventory', {
          recordType: recordTypes.InitialInventory,
        }),
    },
  ];
};

const DATE_FORMAT = 'MMM D, YYYY hh:mm A';

export const getDate = d => {
  const date = moment.utc(d);
  if (date.isValid()) {
    return date.format(DATE_FORMAT);
  } else {
    return moment.utc(d, 'DD-MM-YYYY hh:mm').format(DATE_FORMAT);
  }
};
