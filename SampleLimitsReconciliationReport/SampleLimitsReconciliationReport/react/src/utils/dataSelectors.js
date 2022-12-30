import { formatDate } from './dateTimeFormat';

export const selectAccountData = (records) => {
  let newArr = [];

  records.map((el) => {
    newArr.push({
      id: el.sampleLimitErrorId,

      accountName: el.callAccountName,
      accountSpecialty: el.callAccountSpecialty,
      limitTemplateName: el.limitTemplateName,
      sampleId: el.sampleId,
      sampleName: el.sampleName,
      sampleQuantity: el.sampleQuantity,
      limitJsonTemplate: el.limitJsonTemplate,
      errorMessage: el.sampleLimitErrorMessage,
    });
  });

  return newArr;
};

export const selectActivityData = (records) => {
  let newArr = [];

  records.map((el) => {
    newArr.push({
      callName: el.callName,
      callStatus: el.callStatus,
      callLocation: el.callLocation,
      callTerritory: el.callTerritory,
      callDateTime: formatDate(el.callDateTime),
      sampleName: el.sampleName,
      sampleQuantity: el.callSampleOrderQuantity,
      sampleDTPProduct: el.sampleDTPProduct,
      samplePhysicalDrop: el.samplePhysicalDrop,
      signatureDate: formatDate(el.callSignatureDate),
      submittedDate: formatDate(el.callSubmittedDate),
    });
  });

  return newArr;
};
