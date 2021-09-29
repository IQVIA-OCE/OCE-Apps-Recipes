import * as Yup from 'yup';
import { INVENTORY_STATUS } from './constants';

export const getValidationSchema = (
  { showCalculatedFields, showSystemCount },
  types
) =>
  Yup.object().shape({
    reason: Yup.string().when(['status', 'buttonPressed'], {
      is: (status, buttonPressed) => {
        return (
          (status === INVENTORY_STATUS.inProgress &&
            buttonPressed === INVENTORY_STATUS.saved) ||
          !types.AdHocInventory
        );
      },
      then: Yup.string().nullable(),
      otherwise: Yup.string()
        .required('Complete this field.')
        .typeError('Complete this field.'),
    }),
    auditor: Yup.string().when(['status', 'buttonPressed'], {
      is: (status, buttonPressed) => {
        return (
          (status === INVENTORY_STATUS.inProgress &&
            buttonPressed === INVENTORY_STATUS.saved) ||
          !types.AuditedInventory
        );
      },
      then: Yup.string().nullable(),
      otherwise: Yup.string()
        .required('Complete this field.')
        .typeError('Complete this field.'),
    }),
    products: Yup.array().when(['status', 'buttonPressed'], {
      is: (status, buttonPressed) => {
        return (
          status === INVENTORY_STATUS.saved &&
          buttonPressed === INVENTORY_STATUS.submitted
        );
      },
      then: Yup.array().of(
        Yup.object().shape({
          discrepancyReason: Yup.string().when(
            ['physicalQuantity', 'systemCount', 'selected', 'deleted'],
            {
              is: (physicalQuantity, systemCount, selected, deleted) => {
                if (deleted) return false;
                if (selected) return true;
                return systemCount !== parseInt(physicalQuantity);
              },
              then: Yup.string()
                .defined('Please add reason.')
                .required('Please add reason.')
                .typeError('Please add reason.'),
              otherwise: Yup.string().nullable(),
            }
          ),
        })
      ),
      otherwise: Yup.array().when(['status', 'buttonPressed'], {
        is: (status, buttonPressed) => {
          return (
            status === INVENTORY_STATUS.inProgress &&
            buttonPressed === INVENTORY_STATUS.saved
          );
        },
        then: Yup.array().of(
          Yup.object().shape({
            discrepancyReason: Yup.string().nullable(),
            physicalQuantity: Yup.number()
              .nullable()
              .integer('Enter a valid value.')
              .max(99999, 'Please enter quantity less than or equal to 99,999.')
              .min(0, 'Should not be less than 0.')
              .typeError('Enter a valid value.'),
          })
        ),
        otherwise: Yup.array().of(
          Yup.object().shape({
            lotNumberId: Yup.string().required('Required'),
            physicalQuantity: Yup.number()
              .integer('Enter a valid value.')
              .required('Complete this field.')
              .max(99999, 'Please enter quantity less than or equal to 99,999.')
              .min(0, 'Should not be less than 0.')
              .typeError('Enter a valid value.'),
            discrepancyReason: Yup.string().when(
              ['physicalQuantity', 'systemCount', 'selected'],
              {
                is: (physicalQuantity, systemCount, selected) => {
                  if (showCalculatedFields && showSystemCount) {
                    if (selected) return true;
                    return physicalQuantity !== systemCount;
                  }
                },
                then: Yup.string()
                  .defined('Please add reason.')
                  .required('Please add reason.')
                  .typeError('Please add reason.'),
                otherwise: Yup.string().nullable(),
              }
            ),
          })
        ),
      }),
    }),
  });
