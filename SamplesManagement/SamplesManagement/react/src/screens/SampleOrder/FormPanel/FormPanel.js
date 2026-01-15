import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@oce-apps/apollo-react-native';
import FormDetailsTitle from '../../../components/FormDetailsTitle/FormDetailsTitle';

import PanelHeader from './PanelHeader';
import PanelContent from './PanelContent';

const FormPanel = ({ readonly }) => {
  const theme = useTheme();

  return (
    <>
      <PanelHeader readonly={readonly} />
      <View
        style={[styles.container, { backgroundColor: theme.colors.surface }]}
      >
        <View style={styles.title}>
          <FormDetailsTitle title="ADDITIONAL INFORMATION" />
        </View>
        <PanelContent readonly={readonly} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
  },
  title: {
    paddingHorizontal: 15,
  },
});

export default FormPanel;
