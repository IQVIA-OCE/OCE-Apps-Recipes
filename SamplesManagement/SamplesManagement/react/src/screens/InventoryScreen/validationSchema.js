import * as Yup from 'yup';
import { INVENTORY_STATUS } from './constants';

export const getValidationSchema = (
  { showCalculatedFields, showSystemCount },
  types
) =>
  Yup.object().shape({
    reason: Yup.string().when([], {
      is: () => types.AdHocInventory,
      then: Yup.string().required('Complete this field.'),
      otherwise: Yup.string().nullable(),
    }),
    auditor: Yup.string().when([], {
      is: () => {
        return types.AuditedInventory;
      },
      then: Yup.string().required('Complete this field.'),
      otherwise: Yup.string().nullable(),
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
            ['physicalQuantity', 'systemCount', 'selected'],
            {
              is: (physicalQuantity, systemCount, selected) => {
                if (selected) return true;
                return systemCount !== parseInt(physicalQuantity);
              },
              then: Yup.string().required(),
              otherwise: Yup.string().nullable(),
            }
          ),
        })
      ),
      otherwise: Yup.array().of(
        Yup.object().shape({
          lotNumberId: Yup.string().required('Required'),
          physicalQuantity: Yup.number()
            .integer('Provide integer')
            .required('Required'),
          discrepancyReason: Yup.string().when(
            ['physicalQuantity', 'systemCount', 'selected'],
            {
              is: (physicalQuantity, systemCount, selected) => {
                if (showCalculatedFields && showSystemCount) {
                  if (selected) return true;
                  return physicalQuantity !== systemCount;
                }
              },
              then: Yup.string().required(),
              otherwise: Yup.string().nullable(),
            }
          ),
        })
      ),
    }),
  });
