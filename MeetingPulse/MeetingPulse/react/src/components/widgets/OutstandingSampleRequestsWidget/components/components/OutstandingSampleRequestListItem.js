import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { navigator, externalNavigator } from 'oce-apps-bridges';
import { NAMESPACE } from '../../../../../constants/namespacePrefix';
import { Text } from 'apollo-react-native';
import { Platform } from 'react-native';

const OutstandingSampleRequestListItem = ({ name, samples = [], testID = 'outstandingSampleRequestListItem', callId }) => {

  const handleOnPress = async() => {
      try {
        if (Platform.OS === 'web') {
          await externalNavigator.open(`{EndPoint}&retURL=/apex/${NAMESPACE}RemotePlatformLaunchConference?id=${callId}`);
        } else {
          const callUrl = `oce://deeplink/modal/sobject-name/${NAMESPACE}Call__c/record-id/${callId}/action/view?commands=launchcall`;
          await navigator.openDeeplink(callUrl);
        }
      } catch (e) {
        Alert.alert('Something went wrong', e.message)
      }
  }

  return (
    <View style={styles.container} testID={testID}>
      <Text style={styles.name}>{name}</Text>
      <View>
        {samples.map((item) => (
          <Text style={styles.sample} key={item.Id} onPress={handleOnPress} testID={`sampleItem-${item.Id}`}>
            {item.name} (Qty {item.quantity})
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    marginBottom: 25,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  sample: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 3,
    color: '#3668e4'
  },
  productsWrapper: {},
});

export default OutstandingSampleRequestListItem;
