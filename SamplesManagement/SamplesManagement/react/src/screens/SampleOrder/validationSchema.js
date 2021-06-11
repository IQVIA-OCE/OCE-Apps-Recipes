import * as Yup from 'yup';

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
                  const { path, parent, createError } = this;
                  const { OCE__MinOrder__c, OCE__MaxOrder__c } = parent;

                  if (OCE__MinOrder__c != null && OCE__MaxOrder__c != null){
                    if(val < OCE__MinOrder__c || val > OCE__MaxOrder__c){
                      return createError({
                        path,
                        message: `Please enter quantity between min value ${OCE__MinOrder__c} and max value ${OCE__MaxOrder__c}`
                      });
                    }else{
                      return true;
                    }
                  } else if (OCE__MinOrder__c == null && OCE__MaxOrder__c != null) {
                    if(val < 1 || val > OCE__MaxOrder__c){
                      return createError({
                        path,
                        message: `Please enter quantity less than or equal to ${OCE__MaxOrder__c}`
                      });
                    }else{
                      return true;
                    }
                  } else if (OCE__MinOrder__c != null && OCE__MaxOrder__c == null){
                    if(val < OCE__MinOrder__c || val > 99999){
                      return createError({
                        path,
                        message: `Please enter quantity more than or equal to ${OCE__MinOrder__c}`
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
