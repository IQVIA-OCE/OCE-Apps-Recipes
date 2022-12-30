import { NAMESPACE } from '../constants';
import { formatDate } from './index';

export const mapReport = (reports) =>
  reports.map((el) => ({
    sampleLimitErrorId: el.Id || '',
    sampleLimitErrorMessage: el[`${NAMESPACE}Message__c`] || '',

    limitId: el[`${NAMESPACE}Limit__c`],
    limitTemplateName: el[`${NAMESPACE}Limit__r`][`${NAMESPACE}Template__c`] || '',
    limitJsonTemplate: el[`${NAMESPACE}Limit__r`][`${NAMESPACE}Data__c`] || '',
    callSampleOrderQuantity: el[`${NAMESPACE}CallSampleOrder__r`][`${NAMESPACE}Quantity__c`] || '',
    sampleId: el[`${NAMESPACE}CallSampleOrder__r`][`${NAMESPACE}Sample__c`] || '',
    sampleName: el[`${NAMESPACE}CallSampleOrder__r`][`${NAMESPACE}Sample__r`]['Name'] || '',
    sampleQuantity: el[`${NAMESPACE}CallSampleOrder__r`][`${NAMESPACE}Sample__r`][`${NAMESPACE}Quantity__c`] || '',
    sampleDTPProduct: el[`${NAMESPACE}CallSampleOrder__r`][`${NAMESPACE}Sample__r`][`${NAMESPACE}DTP__c`] || '',
    samplePhysicalDrop: el[`${NAMESPACE}CallSampleOrder__r`][`${NAMESPACE}Sample__r`][`${NAMESPACE}PhysicalSampleDrop__c`] || '',

    callId: el[`${NAMESPACE}CallSampleOrder__r`][`${NAMESPACE}Call__c`] || '',
    callName: el[`${NAMESPACE}CallSampleOrder__r`][`${NAMESPACE}Call__r`]['Name'] || '',
    callLocation: el[`${NAMESPACE}CallSampleOrder__r`][`${NAMESPACE}Call__r`][`${NAMESPACE}Location__r`][`${NAMESPACE}City__c`] || '',
    callTerritory: el[`${NAMESPACE}CallSampleOrder__r`][`${NAMESPACE}Call__r`][`${NAMESPACE}Territory__c`] || '',
    callStatus: el[`${NAMESPACE}CallSampleOrder__r`][`${NAMESPACE}Call__r`][`${NAMESPACE}Status__c`] || '',
    callDateTime: el[`${NAMESPACE}CallSampleOrder__r`][`${NAMESPACE}Call__r`][`${NAMESPACE}CallDateTime__c`] || '',
    callSignatureDate: el[`${NAMESPACE}CallSampleOrder__r`][`${NAMESPACE}Call__r`][`${NAMESPACE}SignatureDate__c`] || '',
    callSubmittedDate: el[`${NAMESPACE}CallSampleOrder__r`][`${NAMESPACE}Call__r`][`${NAMESPACE}SubmissionDate__c`] || '',
    callAccount: el[`${NAMESPACE}CallSampleOrder__r`][`${NAMESPACE}Call__r`][`${NAMESPACE}Account__c`] || '',
    callAccountName: el[`${NAMESPACE}CallSampleOrder__r`][`${NAMESPACE}Call__r`][`${NAMESPACE}Account__r`]['Name'] || '',
    callAccountSpecialty: el[`${NAMESPACE}CallSampleOrder__r`][`${NAMESPACE}Call__r`][`${NAMESPACE}Account__r`][`${NAMESPACE}Specialty__c`] || '',
  }));

export const mapJsonTemplate = (json, sampleId) => {
  const parseProducts = JSON.parse(json).products;
  const keys = Object.keys(parseProducts);

  let sampleLimitProductRules = [];
  let sampleLimitMapProductRules = [];

  keys.forEach((productId) => {
    if (productId === sampleId) {
      sampleLimitProductRules.push(parseProducts[productId]['rules']);
    }
  });

  sampleLimitProductRules.forEach((rules) => {
    for (let rulesName in rules) {
      const startsDate = formatDate(rules[rulesName].starts);
      const endsDate = formatDate(rules[rulesName].ends);
      const label = rules[rulesName].label;
      const calculation = rules[rulesName].calculation;

      sampleLimitMapProductRules.push({
        period: `${startsDate} - ${endsDate}`,
        rulesInfo: `${calculation}: ${label}`,
        quota: rules[rulesName].quota,
        remaining: rules[rulesName].remaining,
      });
    }
  });

  return sampleLimitMapProductRules;
};

export const mapTemplate = (templates) =>
  templates.map((t) => ({
    id: t['Id'],
    label: t['Label'],
    value: t['DeveloperName'],
  }));
