import React, { useContext, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Search, Menu, red, Paragraph } from 'apollo-react-native';
import { useBoolean } from '../../../hooks';
import Loader from '../../../components/Loader/Loader';
import { fetchAuditorById, fetchAuditors } from '../../../api/Inventories';
import { useFormikContext } from 'formik';
import { INVENTORY_FORM_TYPE } from '../../../constants/Inventories';

import { InventoryContext } from '../InventoryContext';

const InventoryAuditor = () => {
  const { editingType } = useContext(InventoryContext);
  const {
    values,
    setFieldValue,
    touched,
    errors,
    setFieldTouched,
  } = useFormikContext();

  const timer = useRef(0);
  const [value, setValue] = useState('');
  const [isVisible, visibleActions] = useBoolean(false);
  const [list, setList] = useState([]);
  const [isLoading, loadingActions] = useBoolean(false);

  const fetchList = text => {
    setValue(text);
    try {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      let auditors;
      if (text.trim() && text !== value) {
        visibleActions.setTrue();
        timer.current = setTimeout(async () => {
          loadingActions.setTrue();
          [auditors] = await fetchAuditors(text);
          setList(auditors);
          loadingActions.setFalse();
        }, 400);
      }
    } catch (e) {
      console.warn({ e });
    }
  };

  const setAuditor = async id => {
    try {
      const [auditor] = await fetchAuditorById(id);

      setValue(auditor[0].Name);
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    if (values.auditor && !value) {
      setAuditor(values.auditor);
    }
  }, []);

  if (editingType !== INVENTORY_FORM_TYPE.edit) {
    return <Paragraph style={{ fontSize: 16 }}>{value}</Paragraph>;
  }

  return (
    <>
      <Menu
        visible={isVisible}
        onDismiss={visibleActions.setFalse}
        anchor={
          <View>
            <Search
              placeholder="Search"
              value={value}
              onChangeText={fetchList}
              style={[styles.search, errors.auditor && styles.error]}
              onIconPress={() => {
                setValue('');
                setFieldValue('auditor', undefined);
              }}
              helperText={
                (touched.auditor || touched.buttonPressed) && errors.auditor
                  ? errors.auditor
                  : null
              }
              error={
                (touched.auditor || touched.buttonPressed) && errors.auditor
                  ? errors.auditor
                  : null
              }
            />
            {isLoading && <Loader />}
          </View>
        }
      >
        {list.map((el) => (
          <Menu.Item
            key={el.Id}
            onPress={() => {
              setValue(el.Name);
              visibleActions.setFalse();
              setFieldValue('auditor', el.Id);
              setFieldTouched('auditor', true);
            }}
          >
            <Text>{el.Name}</Text>
          </Menu.Item>
        ))}
      </Menu>
    </>
  );
};

const styles = StyleSheet.create({
  search: {
    width: 180,
  },
  error: {
    borderColor: red,
  },
});

export default InventoryAuditor;
