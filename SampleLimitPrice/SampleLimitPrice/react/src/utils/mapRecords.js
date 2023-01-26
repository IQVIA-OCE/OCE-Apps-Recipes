import { NAMESPACE } from '../constants';

export const mapProducts = (products) => {
    let resultArr = [];
    products.filter((item) => item[`${NAMESPACE}limitData__c`] !== null).map(
        (prod) => {
            resultArr.push({ value: prod[`${NAMESPACE}AccountGoal__r.${NAMESPACE}Account__r.Id`] });
            return Object.values(JSON.parse(prod[`${NAMESPACE}limitData__c`]).Products).filter((obj) => obj.name)
        }).flat().map((pr, index) => {
            resultArr[index]['label'] = pr.name;
            resultArr[index]['details'] = {
                disbursed: pr.disbursed,
                hqLimit: pr.hqLimit,
                managerLimit: pr.managerLimit,
                quota: pr.quota,
                remaining: pr.remaining,
                repLimit: pr.repLimit,
                minCallLimit: pr.minCallLimit ? pr.minCallLimit : 0,
                maxCallLimit: pr.maxCallLimit ? pr.maxCallLimit : 0
            }
            return resultArr;
        });
    return resultArr;
}
export const mapAccounts = (accounts) => {
    return accounts.map((item) => (
        {
            label: item[`${NAMESPACE}AccountFullname__c`],
            value: item.Id,
        }));
}

