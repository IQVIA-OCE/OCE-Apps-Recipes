import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput } from 'apollo-react-native';
import { useFormikContext } from 'formik';

const PanelContent = () => {
  const context = useFormikContext();
  const { values, setFieldValue } = context;

  return (
    <View style={styles.container}>
      <View style={styles.col}>
        <TextInput
          label="Comments"
          onChangeText={text => setFieldValue('fields.comments', text)}
          value={values.fields.comments}
          multiline
          fullWidth
        />
      </View>
      <View
        style={{
          flex: 1,
        }}
      ></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 15,
    paddingHorizontal: 30,
    marginBottom: 10,
  },
  col: {
    flex: 1,
    marginRight: 20,
    paddingRight: 20,
  },
  field: {
    marginBottom: 15,
  },
});

export default PanelContent;
