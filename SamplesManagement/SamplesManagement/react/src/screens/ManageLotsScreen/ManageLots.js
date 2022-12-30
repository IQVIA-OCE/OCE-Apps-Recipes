import React, { useEffect, useState } from 'react';
import { FlatList, View, StyleSheet, Text } from 'react-native';
import FormHeader from '../../components/FormHeader/FormHeader';
import LotItem from '../../components/LotItem/LotItem';
import { Banner } from 'apollo-react-native';
import { useBanner, useBoolean } from '../../hooks';
import { changeLotStatus, fetchLotsOffset } from '../../api/ManageLots';
import { normalizeLots } from '../DashboardScreen/ManageLotsWidget/utils';
import Loader from '../../components/Loader/Loader';

const keys = {
  CreatedDate: 'createdDate',
  Id: 'id',
  Name: 'name',
  LastModifiedDate: 'lastModified',
  OCE__Lot__r: 'lot',
  OCE__Lot__c: 'lotId',
  OCE__LotExpirationDate__c: 'expirationDate',
  OCE__Product__c: 'productId',
  OCE__Product__r: 'product',
  OCE__IsActive__c: 'isActive',
};
const ITEMS_ON_PAGE = 13;
const ManageLots = ({ navigation }) => {
  const [refreshWidget, refreshWidgetActions] = useBoolean(false);
  const [showActive, showActiveActions] = useBoolean(true);
  const [banner, setBanner] = useBanner();

  const [{ loading, error, data, page }, setValue] = useState({
    loading: true,
    error: '',
    data: null,
    page: 1,
    metadata: null,
  });

  const handleFetch = async () => {
    setValue(prevState => ({
      ...prevState,
      loading: true,
    }));

    try {
      let [data, metadata] = await fetchLotsOffset(ITEMS_ON_PAGE, showActive);

      setValue(prevState => ({
        ...prevState,
        loading: false,
        error: '',
        page: 1,
        data: normalizeLots(keys)(data),
        metadata,
      }));
    } catch (error) {
      setValue(prevState => ({
        ...prevState,
        loading: false,
        error: error,
        data: null,
        metadata: null,
      }));
    }
  };
  const handleLoadMore = async () => {
    try {
      let [newData, metadata] = await fetchLotsOffset(
        ITEMS_ON_PAGE,
        showActive,
        ITEMS_ON_PAGE * page
      );

      setValue(prevState => ({
        ...prevState,
        loading: false,
        error: '',
        data: [...data, ...normalizeLots(keys)(newData)],
        metadata,
        page: page + 1,
      }));
    } catch (error) {
      setValue(prevState => ({
        ...prevState,
        loading: false,
        error: error,
        data: null,
        metadata: null,
      }));
    }
  };
  const handleStatusChange = async (status, id) => {
    try {
      await changeLotStatus(status, id);
      refreshWidgetActions.setTrue();
      setBanner({
        variant: 'success',
        message: 'Success! Lot Allocation status has been updated.',
        visible: true,
        icon: 'checkbox-marked-circle',
      });
      await handleFetch();
    } catch (e) {
      setBanner({
        variant: 'error',
        message: e.message,
        visible: true,
        icon: 'alert-circle',
      });
    }
  };

  useEffect(() => {
    handleFetch();
  }, [showActive]);

  if (error) {
    return (
      <View>
        <Text>{error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {loading && <Loader />}
      <Banner
        variant={banner.variant}
        icon={banner.icon}
        visible={banner.visible}
      >
        {banner.message}
      </Banner>
      <FormHeader
        title="Manage Lots"
        controls={[
          {
            label: 'Back',
            onPress: () =>
              navigation.navigate('Dashboard', {
                refreshLotsWidget: refreshWidget,
              }),
          },
          {
            label: `${showActive ? 'Show' : 'Hide'} Inactive Lots`,
            color: 'primary',
            mode: 'contained',
            onPress: () => {
              showActiveActions.toggle();
            },
          },
        ]}
      />

      <FlatList
        style={styles.list}
        data={data}
        refreshing={loading}
        onRefresh={handleFetch}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item, i }) => (
          <LotItem
            item={item}
            style={styles.item}
            handleStatusChange={status => handleStatusChange(status, item.id)}
          />
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 10,
  },
  separator: {
    borderBottomColor: '#dddbda',
    borderBottomWidth: 1,
  },
  item: {
    marginBottom: 0,
    paddingTop: 10,
    paddingBottom: 5,
  },
});

export default ManageLots;
