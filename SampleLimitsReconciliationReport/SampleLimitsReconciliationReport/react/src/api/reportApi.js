import { NAMESPACE } from '../constants';
import { sfNetAPI } from '@oce-apps/oce-apps-bridges';

/**
 *
 * @param {number} limit
 * @param {number} offset
 * @param {string|undefined} searchQuery
 * @param {string|undefined} templateFilter
 * @param {string|undefined} sortField
 * @param {string|undefined} sortOrder
 */

export const fetchReportData = async ({
  limit = 15,
  offset = 0,
  searchQuery = '',
  templateFilter = '',
  sortField = '',
  sortOrder = 'ASC',
}) => {
  try {
    const whereAccountSearchClause = searchQuery
      ? `AND (${NAMESPACE}CallSampleOrder__r.${NAMESPACE}Call__r.${NAMESPACE}Account__r.Name LIKE '%${searchQuery}%')`
      : '';

    const whereTemplateFilterClause = templateFilter
      ? `AND (${NAMESPACE}Limit__r.${NAMESPACE}Template__c LIKE '%${templateFilter}%')`
      : '';

    const fields = [
      'Id',
      `${NAMESPACE}Message__c`,

      `${NAMESPACE}Limit__c`,
      `${NAMESPACE}Limit__r.${NAMESPACE}Template__c`,
      `${NAMESPACE}Limit__r.${NAMESPACE}Data__c`,

      `${NAMESPACE}CallSampleOrder__r.${NAMESPACE}Quantity__c`,

      `${NAMESPACE}CallSampleOrder__r.${NAMESPACE}Sample__c`,
      `${NAMESPACE}CallSampleOrder__r.${NAMESPACE}Sample__r.Name`,
      `${NAMESPACE}CallSampleOrder__r.${NAMESPACE}Sample__r.${NAMESPACE}Quantity__c`,
      `${NAMESPACE}CallSampleOrder__r.${NAMESPACE}Sample__r.${NAMESPACE}DTP__c`,
      `${NAMESPACE}CallSampleOrder__r.${NAMESPACE}Sample__r.${NAMESPACE}PhysicalSampleDrop__c`,

      `${NAMESPACE}CallSampleOrder__r.${NAMESPACE}Call__c`,
      `${NAMESPACE}CallSampleOrder__r.${NAMESPACE}Call__r.Name`,
      `${NAMESPACE}CallSampleOrder__r.${NAMESPACE}Call__r.${NAMESPACE}Status__c`,
      `${NAMESPACE}CallSampleOrder__r.${NAMESPACE}Call__r.${NAMESPACE}CallDateTime__c`,
      `${NAMESPACE}CallSampleOrder__r.${NAMESPACE}Call__r.${NAMESPACE}SignatureDate__c`,
      `${NAMESPACE}CallSampleOrder__r.${NAMESPACE}Call__r.${NAMESPACE}SubmissionDate__c`,
      `${NAMESPACE}CallSampleOrder__r.${NAMESPACE}Call__r.${NAMESPACE}Territory__c`,
      `${NAMESPACE}CallSampleOrder__r.${NAMESPACE}Call__r.${NAMESPACE}Location__r.${NAMESPACE}City__c`,

      `${NAMESPACE}CallSampleOrder__r.${NAMESPACE}Call__r.${NAMESPACE}Account__c`,
      `${NAMESPACE}CallSampleOrder__r.${NAMESPACE}Call__r.${NAMESPACE}Account__r.Name`,
      `${NAMESPACE}CallSampleOrder__r.${NAMESPACE}Call__r.${NAMESPACE}Account__r.${NAMESPACE}Specialty__c`,
    ];

    let sortClause;
    switch (sortField) {
      case 'accountName':
        sortClause = `${NAMESPACE}CallSampleOrder__r.${NAMESPACE}Call__r.${NAMESPACE}Account__r.Name`;
        break;
      case 'accountSpecialty':
        sortClause = `${NAMESPACE}CallSampleOrder__r.${NAMESPACE}Call__r.${NAMESPACE}Account__r.${NAMESPACE}Specialty__c`;
        break;
      case 'sampleName':
        sortClause = `${NAMESPACE}CallSampleOrder__r.${NAMESPACE}Sample__r.Name`;
        break;
      case 'limitTemplateName':
        sortClause = `${NAMESPACE}Limit__r.${NAMESPACE}Template__c`;
        break;
      default:
        sortClause = `${NAMESPACE}CallSampleOrder__r.${NAMESPACE}Call__r.${NAMESPACE}Account__r.Name`;
    }

    const sortOrderClause = sortOrder ? 'DESC' : 'ASC';

    const query = `SELECT ${fields.join(', ')}\
    FROM ${NAMESPACE}SampleLimitError__c\
    WHERE ${NAMESPACE}CallSampleOrder__c != null ${whereAccountSearchClause} ${whereTemplateFilterClause}\
    ORDER BY ${sortClause} ${sortOrderClause} NULLS FIRST\
    LIMIT ${limit} OFFSET ${offset}`;

    const response = await sfNetAPI.query(query);

    return response.records;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const fetchLimitTemplates = async () => {
  try {
    const query = `SELECT Id, DeveloperName, Label FROM ${NAMESPACE}SampleLimitTemplate__mdt WHERE ${NAMESPACE}IsActive__c = true ORDER BY Label ASC NULLS FIRST`;
    const response = await sfNetAPI.query(query);

    return response.records;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
