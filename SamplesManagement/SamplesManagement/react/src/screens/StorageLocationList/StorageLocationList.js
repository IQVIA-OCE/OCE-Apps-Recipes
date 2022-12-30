import React, { useEffect } from 'react';
import { StyleSheet, View, FlatList, Alert } from 'react-native';
import FormHeader from '../../components/FormHeader/FormHeader';
import {
  deleteLocation,
  fetchLocationsList,
  updateDefaultLocation,
} from '../../api/StorageLocation';
import { Banner, Text, useTheme } from 'apollo-react-native';
import { environment } from 'oce-apps-bridges';
import ListHeader from './ListHeader';
import ListItem from './ListItem';
import StorageLocation from '../StorageLocation/StorageLocation';
import { normalizer } from '../../utils/utils';
import { useBanner, useBoolean, useFetcher } from '../../hooks';
import Loader from "../../components/Loader/Loader";

const keys = {
  OCE__FullAddress__c: 'address',
  OCE__IsDefaultStorageLocation__c: 'isDefault',
  Id: 'id',
};

const StorageLocationList = ({ navigation }) => {
  const [banner, setBanner] = useBanner();
  const userId = environment.userID();
  const [refreshWidget, setRefreshWidgetActions] = useBoolean(false);

  const theme = useTheme();

  const [{ loading, error, data }, { handleFetch, setValue }] = useFetcher(
    async () => await fetchLocationsList(userId),
    normalizer(keys)
  );

  useEffect(() => {
    const event = navigation.addListener('didFocus', () => {
      const refresh = navigation.getParam('refresh');
      if (refresh) {
        handleFetch();
        setRefreshWidgetActions.setTrue();
      }
    });
    return () => event.remove();
  }, [navigation.getParam('refresh')]);

  const handleAction = async (id, type) => {
    setValue(prevState => ({ ...prevState, loading: true }));
    try {
      let message = 'Success';
      if (type === 'changeDefault') {
        await updateDefaultLocation(id);
        message = 'Default Storage Location has been successfully set.';
      }
      if (type === 'delete') {
        await deleteLocation(id);
        message = `Samples Management Address was deleted`;
      }
      handleFetch();
      setRefreshWidgetActions.setTrue();
      setBanner({
        variant: 'success',
        message,
        visible: true,
        icon: 'checkbox-marked-circle',
      });
    } catch (e) {
      console.warn(e);
      setValue(prevState => ({ ...prevState, loading: false }));
      setBanner({
        variant: 'error',
        message: e.message,
        visible: true,
        icon: 'alert-circle',
      });
    }
  };

  const handleDelete = async id => {
    Alert.alert(
      '',
      'Are you sure you want to delete this Samples Management Address?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('cancel'),
          style: 'cancel',
        },
        { text: 'Delete', onPress: () => handleAction(id, 'delete') },
      ],
      { cancelable: false }
    );
  };

  if (error) {
    return (
      <View>
        <Text>{error.message ? error.message : error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      {loading && <Loader/>}
      <Banner
        variant={banner.variant}
        icon={banner.icon}
        visible={banner.visible}
      >
        {banner.message}
      </Banner>
      <FormHeader
        icon="map-marker"
        label="Samples Management"
        title="Samples Management Addresses"
        controls={[
          {
            label: 'Back',
            onPress: () => {
              navigation.navigate('Dashboard', {
                refreshLocationWidget: refreshWidget,
              });
            },
          },
          {
            label: 'New',
            color: 'primary',
            mode: 'contained',
            onPress: () => navigation.navigate('StorageLocation'),
          },
        ]}
      />
      <FlatList
        ListHeaderComponent={ListHeader}
        data={data}
        refreshing={loading}
        onRefresh={handleFetch}
        renderItem={({ item }) => (
          <ListItem
            item={item}
            handleChange={id => handleAction(id, 'changeDefault')}
            handleDelete={id => handleDelete(id)}
            handleEdit={id =>
              navigation.navigate('StorageLocation', { locationId: id })
            }
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default StorageLocationList;
