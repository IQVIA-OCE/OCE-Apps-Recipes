import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import InfoField from './InfoField';
import { AppContext } from '../../AppContext';
import { useFetcher, useHandleData } from '../../hooks';
import { fetchUsers } from '../../api/StorageLocation';
import { normalizeUsers } from './utils';

const Info = ({ values }) => {
  const { username, userId } = useContext(AppContext);
  const ids = [userId];

  if (values.createdById !== userId) {
    ids.push(values.createdById);
  }
  if (values.modifiedById !== userId) {
    ids.push(values.modifiedById);
  }

  const [users] = useFetcher(async () => await fetchUsers(ids), normalizeUsers);

  return useHandleData(users)(data => (
    <View style={styles.form}>
      <View style={styles.col}>
        <InfoField
          label="Created By"
          text={`${
            data[values.createdById] ? data[values.createdById] : username
          } ${values.createdDate}`}
        />
      </View>
      <View style={styles.col}>
        <InfoField
          label="Last Modified By"
          text={`${
            data[values.modifiedById] ? data[values.modifiedById] : username
          } ${values.modifiedDate}`}
        />
      </View>
    </View>
  ));
};

const styles = StyleSheet.create({
  form: {
    padding: 10,
    flexDirection: 'row',
  },
  col: {
    paddingHorizontal: 15,
    flex: 1,
  },
});

export default Info;
