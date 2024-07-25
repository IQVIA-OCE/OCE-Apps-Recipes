import { NAMESPACE } from '../constants';


export const mapAccountProducts = (products) => {
    const response = products.filter((item) => item[`${NAMESPACE}limitData__c`] !== null).map(
        (prod, index) => {
            let accountId = (prod[`${NAMESPACE}AccountGoal__r.${NAMESPACE}Account__r.Id`] ? prod[`${NAMESPACE}AccountGoal__r.${NAMESPACE}Account__r.Id`] :
                prod[`${NAMESPACE}AccountGoal__r`] ? prod[`${NAMESPACE}AccountGoal__r`][`${NAMESPACE}Account__r`][`Id`] : null);
            const limitData = Object.values(JSON.parse(prod[`${NAMESPACE}limitData__c`] || prod[`${NAMESPACE}LimitData__c`]).Products);
            return {
                value: index,
                accountId,
                products: limitData,
            }
        })

    return response;
}

export const mapProducts = (products) => {
    const merged = products.map((res) => (res.products)).flat();
    const unique = [...new Map(merged.map((m) => [m.Name || m.name, m])).values()].map((prod) => ({ label: prod.Name || prod.name, value: prod.Name || prod.name, details: { ...prod } }));
    return unique.sort((a, b) => a.label > b.label ? 1 : -1);
}

export const mapAccounts = (accounts) => {
    return accounts.map((item) => (
        {
            label: item[`${NAMESPACE}AccountFullName__c`] || item[`${NAMESPACE}AccountFullname__c`],
            value: item.Id,
        })).sort((a, b) => a.label > b.label ? 1 : -1);
}
