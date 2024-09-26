import * as Yup from 'yup';
import { NAMESPACE} from '../../constants/constants';

export const getValidationSchema = () =>
  Yup.object().shape({
    fields: Yup.object().shape({
      shipTo: Yup.object()
        .nullable()
        .required('Complete this field.'),
    }),
    products: Yup.array()
      .of(
        Yup.object().shape({
          quantity: Yup.number().when('orderCheck', {
            is: false,
            then: Yup.number()
              .typeError('Enter a valid value.')
              .nullable()
              .max(99999, 'Please enter quantity less than or equal to 99,999.')
              .min(1, 'Must be greater 0 and less 99,999.')
              .required('Complete this field.'),

            //Set max min based on product maxmin values
            otherwise: Yup.number()
              .required('Complete this field.')
              .typeError('Enter a valid value.')
              .nullable()
              .test({
                name: 'maxmin',
                message: '',
                test: function(val) {
                  const { path, createError } = this;

                  if (`${NAMESPACE}MinOrder__c` != null && `${NAMESPACE}MaxOrder__c` != null){
                    if(val < `${NAMESPACE}MinOrder__c` || val > `${NAMESPACE}MaxOrder__c`){
                      return createError({
                        path,
                        message: `Please enter quantity between min value ${`${NAMESPACE}MinOrder__c`} and max value ${`${NAMESPACE}MaxOrder__c`}`
                      });
                    }else{
                      return true;
                    }
                  } else if (`${NAMESPACE}MinOrder__c` == null && `${NAMESPACE}MaxOrder__c` != null) {
                    if(val < 1 || val > `${NAMESPACE}MaxOrder__c`){
                      return createError({
                        path,
                        message: `Please enter quantity less than or equal to ${`${NAMESPACE}MaxOrder__c`}`
                      });
                    }else{
                      return true;
                    }
                  } else if (`${NAMESPACE}MinOrder__c` != null && `${NAMESPACE}MaxOrder__c` == null){
                    if(val < `${NAMESPACE}MinOrder__c` || val > 99999){
                      return createError({
                        path,
                        message: `Please enter quantity more than or equal to ${`${NAMESPACE}MinOrder__c`}`
                      });
                    }else{
                      return true;
                    }
                  }else {
                    if(val < 1 || val > 99999){
                      return createError({
                        path,
                        message: `Must be greater 0 and less 99,999.`
                      });
                    }else{
                      return true;
                    }
                  }
                },
              }),
          }),
        })
      )
      .when('formStatus', {
        is: 'Submitting',
        then: fieldSchema =>
          fieldSchema.required('Please add at least one Product Detail.'),
      }),
  });
