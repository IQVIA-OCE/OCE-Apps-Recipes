import { NAMESPACE } from '../constants/namespacePrefix';
import * as Yup from 'yup';

export const EditActivityPlanSchema = Yup.object().shape({
  [`${NAMESPACE}ActivityType__c`]: Yup.object({
    label: Yup.string().required(),
    value: Yup.string().required(),
  })
    .required('Field is required')
    .nullable(),
  [`${NAMESPACE}Reason__c`]: Yup.object({
    label: Yup.string().required(),
    value: Yup.string().required(),
  })
    .required('Field is required')
    .nullable(),
});

export const RemoveActivityPlanSchema = Yup.object().shape({
  [`${NAMESPACE}Reason__c`]: Yup.object({
    label: Yup.string().required(),
    value: Yup.string().required(),
  })
    .required('Field is required')
    .nullable(),
  [`${NAMESPACE}Confirmation__c`]: Yup.boolean().oneOf(
    [true],
    'Field is required'
  ),
});

export const AddActivityToPlanSchema = Yup.object().shape({
  [`${NAMESPACE}ActivityType__c`]: Yup.object({
    label: Yup.string().required(),
    value: Yup.string().required(),
  })
    .required('Field is required')
    .nullable(),
  [`${NAMESPACE}Account__c`]: Yup.object({
    label: Yup.string().required(),
    value: Yup.string().required(),
  })
    .required()
    .nullable(),
  [`${NAMESPACE}Reason__c`]: Yup.object({
    label: Yup.string().required(),
    value: Yup.string().required(),
  })
    .required('Field is required')
    .nullable(),
});
