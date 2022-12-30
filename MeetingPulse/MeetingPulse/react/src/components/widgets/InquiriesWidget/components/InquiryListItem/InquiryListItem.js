import { navigator } from 'oce-apps-bridges';
import React from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { themePrimary, Text } from 'apollo-react-native';

import { NAMESPACE } from '../../../../../constants/namespacePrefix';

export const InquiryListItem = ({ account }) => {
  const { inquiries, name } = account;

  const handlePress = async inquiryId => {
    try {
      await navigator.navigate({}, `${NAMESPACE}Inquiry__c`, inquiryId, 'present', 'view');
    } catch (error) {
      Alert.alert('Something went wrong', error.message);
    }
  };

  return (
    <View style={styles.root}>
      <Text style={styles.author}>{name}</Text>
      {inquiries.map(i => (
        <React.Fragment key={i.id}>
          <TouchableOpacity onPress={() => handlePress(i.id)} style={styles.nameWrapper}>
            <Text style={styles.name}>
              (<Text style={[styles.name, { color: themePrimary[500] }]}>{i.name}</Text>)
            </Text>
          </TouchableOpacity>
          <View style={styles.questions}>
            {i.questions.map((q, qIdx) => (
              <Text key={q.id} style={[styles.text, qIdx === i.questions.length - 1 && styles.textLastItem]}>
                {q.question}
              </Text>
            ))}
          </View>
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    marginBottom: 30,
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
    marginBottom: 10,
  },
  questions: {
    marginBottom: 10,
  },
  text: {
    maxWidth: 250,
    width: '100%',
    marginBottom: 12,
    fontSize: 16,
  },
  textLastItem: {
    marginBottom: 8,
  },
});
