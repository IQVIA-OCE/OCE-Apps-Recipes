import React, { useContext, useEffect, useState } from 'react';
import {
  fetchActiveLotsProducts,
  fetchConfigs,
  fetchInventoryById,
  fetchInventoryDetail,
  fetchInventoryTypes,
  fetchLastSubmittedInventory,
  fetchTransactionDetails,
} from '../../api/Inventories';
import { normalizer } from '../../utils/utils';
import { AppContext } from '../../../AppContext';
import {
  getConfig,
  normalizeProductsList,
  normalizeProductsHistoryList,
} from './utils';
import { withNavigation } from 'react-navigation';
import { INVENTORY_STATUS } from './constants';
import { normalizeRecordTypes } from '../DashboardScreen/InventoriesWidget/utils';
import moment from 'moment';
import { INVENTORY_FORM_TYPE } from '../../constants/Inventories';

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
  OCE__Status__c: 'status',
  RecordTypeId: 'recordTypeId',
  OCE__Comments__c: 'comments',
  Name: 'name',
  OCE__Reason__c: 'reason',
  OCE__Auditor__c: 'auditor',
};

const configKeys = {
  OCE__SIShowSystemCalculatedFields__c: 'showCalculatedFields',
  OCE__SIShowSystemCount__c: 'showSystemCount',
  SetupOwnerId: 'ownerId',
  OCE__SIShowLoggedInUserRecords__c: 'record',
  OCE__STFinalStatus__c: 'status',
  OCE__SIHistoryListHidden__c: 'historyHidden',
};

const ContextProvider = ({ children, navigation }) => {
  const [state, setState] = useState(initialValue);
  const { userId, profileId, orgId } = useContext(AppContext);

  const handleFetchConfig = async () => {
    const [configsData] = await fetchConfigs(userId, profileId, orgId);

    const configs = normalizer(configKeys)(configsData);
    return getConfig(configs, [userId, profileId, orgId]);
  };

  const handleEditingType = editingType =>
    setState(prevState => ({ ...prevState, editingType }));

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
      const config = await handleFetchConfig();

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

      if (navigation.state.params.id) {
        // preview or edit existing inventory
        [inventory] = await fetchInventoryById(navigation.state.params.id);
        [inventoryDetails] = await fetchInventoryDetail(
          navigation.state.params.id,
          state.editingType === INVENTORY_FORM_TYPE.preview
            ? false
            : inventory[0].OCE__Status__c !== INVENTORY_STATUS.inProgress
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
          navigation.state.params.id
        );
      }
      let productsHistory = normalizeProductsHistoryList(transactionDetails);

      const [productsList] = await fetchActiveLotsProducts();

      [products, preselectedProducts] = normalizeProductsList(
        productsList,
        lastSubmittedInventoriesDetails,
        inventoryDetails,
        transactionDetails,
        navigation.state.params.id ? inventory.status : null,
        Boolean(navigation.state.params.id)
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
        if (navigation.state.params.id) {
          const recordType = recordTypes.all.find(
            el => el.Id === inventory.recordTypeId
          );

          state.editingType =
            navigation.state.params.type || INVENTORY_FORM_TYPE.preview;
          state.recordType = recordType;
          state.formInitialValues = {
            ...inventory,
            datetime: inventory.createdDate,
            products: preselectedProducts,
            buttonPressed: '',
          };
        } else {
          state.editingType = INVENTORY_FORM_TYPE.edit;
          state.recordType = navigation.state.params.recordType;
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

export default withNavigation(ContextProvider);
