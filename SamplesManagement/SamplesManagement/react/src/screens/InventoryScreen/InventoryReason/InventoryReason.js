import React, { useContext, useEffect } from 'react';
import { useFormikContext } from 'formik';
import { REASON_LIST } from '../constants';
import { InventoryContext } from '../InventoryContext';
import { INVENTORY_FORM_TYPE } from '../../../constants/Inventories';
import { Select, Paragraph } from '@oce-apps/apollo-react-native';

const InventoryReason = ({}) => {
  const { editingType } = useContext(InventoryContext);
  const {
    values,
    setFieldValue,
    touched,
    errors,
    setFieldTouched,
  } = useFormikContext();

  if (editingType !== INVENTORY_FORM_TYPE.edit) {
    return <Paragraph style={{ fontSize: 16 }}>{values.reason}</Paragraph>;
  }

  useEffect(() => {
    if (
      editingType !== INVENTORY_FORM_TYPE.preview &&
      values.reason &&
      !values.reasonObj
    ) {
      const reasonObj = REASON_LIST.find(el => el.id === values.reason);

      if (reasonObj) {
        setFieldValue('reasonObj', reasonObj);
      }
    }
  }, []);

  return (
    <Select
      options={REASON_LIST}
      placeholder={'-None-'}
      value={values.reasonObj}
      onChange={value => {
        setFieldValue('reason', value ? value.id : null);
        setFieldValue('reasonObj', value, false);
        setFieldTouched('reason', true, false);
      }}
      helperText={
        (touched.reason || touched.buttonPressed) && errors.reason
          ? errors.reason
          : null
      }
      style={{ width: 220 }}
      error={
        (touched.reason || touched.buttonPressed) && errors.reason
          ? errors.reason
          : null
      }
      readonly
    />
  );
};

export default InventoryReason;
