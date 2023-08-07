import { navigator } from 'oce-apps-bridges';
import React from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { themePrimary, Text } from 'apollo-react-native';

import { NAMESPACE } from '../../../../../constants/namespacePrefix';

export const InsightListItem = ({ account }) => {
  const { insights, name } = account;

  const handlePress = async parentInsightId => {
    try {
      await navigator.navigate({}, `${NAMESPACE}Insight__c`, parentInsightId, 'present', 'view');
    } catch (error) {
      Alert.alert('Something went wrong', error.message);
    }
  };

  return (
    <View style={styles.root}>
      <Text style={styles.author}>{name}</Text>
      {insights.map(i => (
        <React.Fragment key={i.id}>
          <TouchableOpacity onPress={() => handlePress(i.parentInsightId)} style={styles.nameWrapper}>
            <Text style={styles.name}>
              {i.name}{' '}
              {i.parentInsightId && (
                <>
                  {'('}
                  <Text style={[styles.name, { color: themePrimary[500] }]}>{i.parentInsightId}</Text>
                  {')'}
                </>
              )}
            </Text>
          </TouchableOpacity>
          <Text key={i.id} style={styles.text}>
            {i.text}
          </Text>
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    marginBottom: 15,
    maxWidth: '100%',
    paddingVertical: 10,
  },
  author: {
    fontWeight: '500',
    fontSize: 18,
    marginBottom: 10,
  },
  nameWrapper: {
    marginBottom: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  name: {
    fontWeight: '600',
    fontSize: 18,
    marginBottom: 15,
  },
  text: {
    maxWidth: 250,
    width: '100%',
    marginBottom: 10,
    fontSize: 16,
  },
});
