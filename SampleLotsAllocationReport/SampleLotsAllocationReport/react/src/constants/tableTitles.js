import { NAMESPACE } from "./namespace"

export const REPORT_TABLE_TITLES = [{
    title: 'Product',
    fieldName: 'productName',
    sortField: `${NAMESPACE}Lot__r.${NAMESPACE}Product__r.Name`
}, {
    title: 'Lot #',
    fieldName: 'lotName',
    sortField: `${NAMESPACE}Lot__r.Name`
}, {
    title: 'Allocated Quantity',
    fieldName: 'allocatedQuantity',
    sortField: `${NAMESPACE}AllocatedQuantity__c`
},
{
    title: 'Remaining Quantity',
    fieldName: 'remainingQuantity',
    sortField: `${NAMESPACE}RemainingQuantity__c`
}]


export const TRANSACTION_TABLE_TITLE = [{
    title: 'Record Type',
    fieldName: 'recordType',
    sortField: `${NAMESPACE}SampleTransaction__r.RecordType.DeveloperName`
}, {
    title: 'Transaction\nDate',
    fieldName: 'transactionDate',
    sortField: `${NAMESPACE}SampleTransaction__r.${NAMESPACE}TransactionDateTime__c`
}, {
    title: 'Transaction\nStatus',
    fieldName: 'status',
    sortField: `${NAMESPACE}SampleTransaction__r.${NAMESPACE}Status__c`
}, {
    title: 'Call',
    fieldName: 'call',
    sortField: `${NAMESPACE}SampleTransaction__r.${NAMESPACE}Call__r.Name`
}, {
    title: 'Call Sample',
    fieldName: 'callSample',
    sortField: `${NAMESPACE}CallSample__r.Name`
}, {
    title: 'Product',
    fieldName: 'product',
    sortField: null
}, {
    title: 'Quantity',
    fieldName: 'quantity',
    sortField: `${NAMESPACE}Quantity__c`
}]


export const DTP_REPORT_TABLE_TITLE = [{
    title: 'Parent\nProduct',
    fieldName: 'productName',
    sortField: `${NAMESPACE}Product__r.Name`
}, {
    title: 'Product',
    fieldName: 'product',
    sortField: `${NAMESPACE}Product__r.Name`
}, {
    title: 'Plan Cycle',
    fieldName: 'planCycle',
    sortField: `${NAMESPACE}PlanCycle__r.Name`
}, {
    title: 'Allocated\nQuantity',
    fieldName: 'allocatedQuantity',
    sortField: `${NAMESPACE}AllocatedQuantity__c`
}, {
    title: 'Max Limit\nPer Call',
    fieldName: 'maxLimitPerCall',
    sortField: `${NAMESPACE}MaxLimitPerCall__c`
}, {
    title: 'Allocations\nUsed',
    fieldName: 'allocationsUsed',
    sortField: `${NAMESPACE}AllocationsUsed__c`
}, {
    title: 'Allocations\nRemaining',
    fieldName: 'allocationsRemaining',
    sortField: `${NAMESPACE}AllocationsRemaining__c`
}]


export const DTP_DETAIL_TABLE_TITLE =

    [{
        title: 'Call\nAccount',
        fieldName: 'callAccount',
        sortField: `${NAMESPACE}Call__r.${NAMESPACE}Account__r.Name`
    }, {
        title: 'Date',
        fieldName: 'date',
        sortField: `${NAMESPACE}Call__r.${NAMESPACE}Date__c`
    }, {
        title: 'Status',
        fieldName: 'status',
        sortField: `${NAMESPACE}Call__r.${NAMESPACE}Status__c`
    }, {
        title: 'Sample Order Account',
        fieldName: 'sampleOrderAccount',
        sortField: `${NAMESPACE}Account__r.Name`
    }, {
        title: 'Product',
        fieldName: 'product',
        sortField: null
    }, {
        title: 'Sample',
        fieldName: 'sample',
        sortField: null
    }, {
        title: 'Quantity',
        fieldName: 'quantity',
        sortField: `${NAMESPACE}Quantity__c`
    }, {
        title: 'Quantity Shipped',
        fieldName: 'quantityShipped',
        sortField: `${NAMESPACE}QuantityShipped__c`
    }, {
        title: 'Date\nShipped',
        fieldName: 'dateShipped',
        sortField: `${NAMESPACE}DateShipped__c`
    }, {
        title: 'Final Quantity',
        fieldName: 'finalQuantity',
        sortField: `${NAMESPACE}FinalQuantity__c`
    }]

