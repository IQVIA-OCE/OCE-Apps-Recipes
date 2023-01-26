import moment from 'moment';
import { INVENTORY_STATUS } from './constants';

const AOS_RECORDTYPE = 'AcknowledgementOfShipment';
const RETURN_RECORDTYPE = 'Return';
const TRANSFEROUT_RECORDTYPE = 'TransferOut';
const TRANSFERIN_RECORDTYPE = 'TransferIn';
const ADJUSTMENT_RECORDTYPE = 'Adjustment';

export const normalizeProductsList = (
  products,
  lastSubmittedInventoriesDetails,
  inventoriesDetails,
  transactions,
  status,
  exist
) => {
  const selectedProducts = [];

  const normalizedProducts = products.map(el => {
    let obj = {
      deleted: false,
      locked: false,
      hasQuantityError: false,
      discrepancyReason: '',
    };

    obj.lotNumberId = el.Id;
    obj.sampleProductId = el.OCE__Product__c;
    obj.detailLabel = el.Name;
    obj.lotNumber = el.Name;
    obj.label = el.OCE__Product__r ? el.OCE__Product__r.Name : '';
    obj.quantityIn = 0;
    obj.quantityOut = 0;
    obj.openingBalance = 0;
    obj.systemCount = 0;
    obj.physicalQuantity = null;

    lastSubmittedInventoriesDetails &&
      lastSubmittedInventoriesDetails.length &&
      lastSubmittedInventoriesDetails.forEach(inventory => {
        if (inventory.OCE__Lot__c === el.Id) {
          if (!obj.locked) {
            obj.locked = true;
            selectedProducts.push(obj);
          }

          if (
            inventory.OCE__Status__c === INVENTORY_STATUS.submitted ||
            inventory.OCE__Status__c === INVENTORY_STATUS.saved ||
            (inventory.OCE__Status__c === INVENTORY_STATUS.inProgress && exist)
          ) {
            obj.openingBalance = inventory.OCE__PhysicalCount__c;
            obj.systemCount = inventory.OCE__PhysicalCount__c;
          }
        }
      });

    inventoriesDetails &&
      inventoriesDetails.length &&
      inventoriesDetails.forEach(inventory => {
        if (inventory.OCE__Lot__c === el.Id) {
          if (!obj.locked) {
            if (status === INVENTORY_STATUS.inProgress && exist) {
              obj.selected = true;
            } else {
              obj.locked = true;
            }
            selectedProducts.push(obj);
          }
          obj.id = inventory.Id;
          obj.physicalQuantity =
            inventory.OCE__PhysicalCount__c &&
            inventory.OCE__PhysicalCount__c.toString();
          obj.discrepancyReason = inventory.OCE__DiscrepancyReason__c;
        }
      });

    if (status !== INVENTORY_STATUS.submitted && transactions.length) {
      transactions.forEach(transaction => {
        if (transaction.OCE__LotNumber__c === el.Id) {
          if (!obj.locked) {
            // product should be pushed into array if it neither locked nor selected
            if (!obj.selected) {
              selectedProducts.push(obj);
            }
            obj.locked = true;
          }

          obj = getQuantity(transaction, obj);
        }
      });
    }

    return obj;
  });

  return [normalizedProducts, selectedProducts];
};

export const normalizeProductsHistoryList = products =>
  products.map(product => {
    return {
      recordType: product.OCE__SampleTransaction__r.RecordType,
      quantity: product.OCE__Quantity__c,
      transactionDateTime: moment
        .utc(product.OCE__SampleTransaction__r.OCE__TransactionDateTime__c)
        .format('MMM D, YYYY hh:mm A'),
      productName: product.OCE__Product__r ? product.OCE__Product__r.Name : '',
      productId: product.OCE__Product__c,
      lotId: product.OCE__LotNumber__c,
      lotNumber: product.OCE__LotNumber__r.Name,
    };
  });

export const getQuantity = (transaction, obj) => {
  switch (transaction.OCE__SampleTransaction__r.RecordType.DeveloperName) {
    case AOS_RECORDTYPE:
    case TRANSFERIN_RECORDTYPE:
      obj.quantityIn += transaction.OCE__Quantity__c;
      break;

    case ADJUSTMENT_RECORDTYPE:
      if (transaction.OCE__Quantity__c > 0) {
        obj.quantityIn += transaction.OCE__Quantity__c;
      } else {
        obj.quantityOut += transaction.OCE__Quantity__c * -1;
      }
      break;
    case RETURN_RECORDTYPE:
    case TRANSFEROUT_RECORDTYPE:
      obj.quantityOut += transaction.OCE__Quantity__c;
      break;
  }

  obj.systemCount = obj.openingBalance + obj.quantityIn - obj.quantityOut;

  return obj;
};

export const checkProductsInvalid = products =>
  products.find(el => el.systemCount !== parseInt(el.physicalQuantity));
