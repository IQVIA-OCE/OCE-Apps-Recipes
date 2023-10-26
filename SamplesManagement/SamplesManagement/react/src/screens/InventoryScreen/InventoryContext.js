import React, { useContext, useEffect, useState } from 'react';
import {
  fetchActiveLotsProducts,
  fetchInventoryById,
  fetchInventoryDetail,
  fetchInventoryTypes,
  fetchLastSubmittedInventory,
  fetchTransactionDetails,
} from '../../api/Inventories';
import { normalizer } from '../../utils/utils';
import { AppContext } from '../../AppContext';
import {
  normalizeProductsList,
  normalizeProductsHistoryList,
} from './utils';
import { INVENTORY_STATUS } from './constants';
import { normalizeRecordTypes } from '../DashboardScreen/InventoriesWidget/utils';
import moment from 'moment';
import { INVENTORY_FORM_TYPE } from '../../constants/Inventories';
import { customSettings } from 'oce-apps-bridges';
import { NAMESPACE } from '../../constants/constants';
import { useNavigation, useRoute } from '@react-navigation/native';

const initialValue = {
  editingType: INVENTORY_FORM_TYPE.preview,
  isLoading: true,
  preselectedProducts: [],
  products: [],
  productsHistory: [],
  error: null,
  config: {},
  lastInventoryCreatedDate: null,
  transactionDetails: [],
  recordType: {},
  formInitialValues: {},
};
export const InventoryContext = React.createContext(initialValue);

const inventoryKeys = {
  CreatedDate: 'createdDate',
  Id: 'id',
  [`${NAMESPACE}Status__c`]: 'status',
  RecordTypeId: 'recordTypeId',
  [`${NAMESPACE}Comments__c`]: 'comments',
  Name: 'name',
  [`${NAMESPACE}Reason__c`]: 'reason',
  [`${NAMESPACE}Auditor__c`]: 'auditor',
};

const configKeys = {
  [`${NAMESPACE}sishowsystemcalculatedfields__c`]: 'showCalculatedFields',
  [`${NAMESPACE}sishowsystemcount__c`]: 'showSystemCount',
  [`${NAMESPACE}sishowloggedinuserrecords__c`]: 'record',
  [`${NAMESPACE}stfinalstatus__c`]: 'status',
  [`${NAMESPACE}sihistorylisthidden__c`]: 'historyHidden',
  setupownerid: 'ownerId',
};

const ContextProvider = ({ children }) => {
  const [state, setState] = useState(initialValue);
  const { userId } = useContext(AppContext);
  const handleEditingType = editingType =>
    setState(prevState => ({ ...prevState, editingType }));

  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    handlePrepareData();
  }, []);

  const handlePrepareData = async () => {
    try {
      let inventory,
        transactionDetails,
        lastSubmittedInventoriesDetails,
        inventoryDetails,
        products,
        preselectedProducts,
        lastInventoryCreatedDate;

      const settings = await customSettings.getCustomSetting(`${NAMESPACE}SamplesManagemenConfig__c`);
      const config = normalizer(configKeys)([settings])

      const [recordTypesData] = await fetchInventoryTypes();
      const recordTypes = normalizeRecordTypes(recordTypesData);

      const [lastInventories] = await fetchLastSubmittedInventory(
        userId,
        config.record
      );

      if (lastInventories.length) {
        inventory = [lastInventories[lastInventories.length - 1]];

        lastInventoryCreatedDate = inventory[0].CreatedDate;
        [lastSubmittedInventoriesDetails] = await fetchInventoryDetail(
          inventory[0].Id,
          true
        );
      } else {
        inventory = [
          {
            status: INVENTORY_STATUS.inProgress,
          },
        ];
      }

      if (route.params?.id) {
        // preview or edit existing inventory
        [inventory] = await fetchInventoryById(route.params?.id);
        [inventoryDetails] = await fetchInventoryDetail(
          route.params?.id,
          state.editingType === INVENTORY_FORM_TYPE.preview
            ? false
            : inventory[0][`${NAMESPACE}Status__c`] !== INVENTORY_STATUS.inProgress
        );
      }

      [inventory] = normalizer(inventoryKeys)(inventory);

      if (inventory.status === INVENTORY_STATUS.inProgress) {
        [transactionDetails] = await fetchTransactionDetails(
          null,
          userId,
          config.status || 'Submitted'
        );
      } else {
        [transactionDetails] = await fetchTransactionDetails(
          route.params?.id
        );
      }
      let productsHistory = normalizeProductsHistoryList(transactionDetails);


      const [productsList] = await fetchActiveLotsProducts();

      [products, preselectedProducts] = normalizeProductsList(
        productsList,
        lastSubmittedInventoriesDetails,
        inventoryDetails,
        transactionDetails,
        route.params?.id ? inventory.status : null,
        Boolean(route.params?.id)
      );

      setState(prevState => {
        let state = {
          ...prevState,
          isLoading: false,
          products,
          productsHistory,
          config,
          transactionDetails,
          lastInventoryCreatedDate,
        };

        if (route.params?.id) {
          const recordType = recordTypes.all.find(
            el => el.Id === inventory.recordTypeId
          );

          state.editingType =
            route.params?.type || INVENTORY_FORM_TYPE.preview;
          state.recordType = recordType;
          state.formInitialValues = {
            ...inventory,
            datetime: inventory.createdDate,
            products: preselectedProducts,
            buttonPressed: '',
          };
        } else {
          state.editingType = INVENTORY_FORM_TYPE.edit;
          state.recordType = route.params?.recordType;
          state.formInitialValues = {
            id: '',
            datetime: moment(),
            products: preselectedProducts,
            status: INVENTORY_STATUS.inProgress,
            buttonPressed: '',
          };
        }

        return state;
      });
    } catch (error) {
      console.warn({ error });
      setState(prevState => ({
        ...prevState,
        isLoading: false,
        error,
      }));
    }
  };

  return (
    <InventoryContext.Provider
      value={{
        ...state,
        actions: { handleEditingType },
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export default ContextProvider;
