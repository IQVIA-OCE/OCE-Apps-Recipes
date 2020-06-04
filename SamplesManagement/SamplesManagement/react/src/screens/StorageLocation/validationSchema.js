import * as Yup from 'yup';

export default Yup.object().shape({
  address1: Yup.string()
    .max(80, 'Too Long!')
    .required('Complete this field'),
  address2: Yup.string()
    .nullable()
    .max(100, 'Too Long!'),
  city: Yup.string()
    .max(100, 'Too Long!')
    .nullable()
    .required('Complete this field'),
  zip: Yup.string()
    .nullable()
    .max(10, 'Too Long!'),
});
