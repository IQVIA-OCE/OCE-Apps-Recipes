import { RadioButton, Text, useTheme } from 'apollo-react-native';
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  ADD_ACTIVITY,
  UPDATE_ACTIVITY,
  REMOVE_ACTIVITY,
} from '../../constants/routes';
import { isIphone } from '../../helpers';
import { withNavigation } from 'react-navigation';
import {
  ADD_ACCOUNT_TYPE,
  REMOVE_ACCOUNT_TYPE,
  UPDATE_ACTIVITY_TYPE,
} from '../../constants/updateRecordTypes';
import Header from '../../components/Header/Header';

const NewActivityPlanChangeRequest = ({ navigation }) => {
  const [checkValue, setCheckBox] = useState(ADD_ACTIVITY);

  const theme = useTheme();

  let styles = { ...stylesDefault, ...stylesIpad };
  if (isIphone) {
    styles = { ...styles, ...stylesIphone };
  }
  const redirectToNext = () => {
    navigation.navigate(checkValue);
  };
  return (
    <View
      testID="NewActivityPlanChangeRequest"
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      <Header
        title="New Activity Plan Change Request"
        onSave={redirectToNext}
        cancelText={null}
        saveText="Next"
      />
      <View style={styles.sectionWrapper}>
        <Text style={[styles.subtitle, { color: theme.colors.text }]}>Select a record type:</Text>
        <View style={styles.radiobuttonsWrapper} testID="ActivityTypeRadioButton">
          <RadioButton.Group
            onValueChange={(v) => setCheckBox(v)}
            value={checkValue}
          >
            <RadioButton label={ADD_ACCOUNT_TYPE} value={ADD_ACTIVITY} />
            <RadioButton label={UPDATE_ACTIVITY_TYPE} value={UPDATE_ACTIVITY} />
            <RadioButton label={REMOVE_ACCOUNT_TYPE} value={REMOVE_ACTIVITY} />
          </RadioButton.Group>
        </View>
      </View>
    </View>
  );
};

const stylesDefault = StyleSheet.create({
  cancelButton: {
    marginRight: 5,
    backgroundColor: '#fff'
  },
});

const stylesIphone = StyleSheet.create({
  title: {
    padding: 20,
    width: '100%',
    textAlign: 'center',
    fontSize: 18,
  },
  sectionWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  subtitle: {
    fontSize: 16,
  },
  radiobuttonsWrapper: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
});

const stylesIpad = StyleSheet.create({
  title: {
    padding: 20,
    width: '100%',
    textAlign: 'center',
    fontSize: 22,
  },
  sectionWrapper: {
    paddingHorizontal: 70,
    paddingVertical: 50,
  },
  subtitle: {
    fontSize: 18,
  },
  radiobuttonsWrapper: {
    paddingHorizontal: 200,
    paddingVertical: 20,
  },
});

export default withNavigation(NewActivityPlanChangeRequest);
