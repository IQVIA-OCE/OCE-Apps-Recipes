import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import FormHeader from '../../components/FormHeader/FormHeader';
import LotItem from '../../components/LotItem/LotItem';
import { Banner, Text, useTheme } from '@oce-apps/apollo-react-native';
import { useBanner, useBoolean } from '../../hooks';
import { changeLotStatus, fetchLotsOffset } from '../../api/ManageLots';
import { normalizeLots } from '../DashboardScreen/ManageLotsWidget/utils';
import Loader from '../../components/Loader/Loader';
import color from 'color';
import { NAMESPACE } from '../../constants/constants';

const keys = {
  CreatedDate: 'createdDate',
  Id: 'id',
  Name: 'name',
  LastModifiedDate: 'lastModified',
  [`${NAMESPACE}Lot__r`]: 'lot',
  [`${NAMESPACE}Lot__c`]: 'lotId',
  [`${NAMESPACE}LotExpirationDate__c`]: 'expirationDate',
  [`${NAMESPACE}Product__c`]: 'productId',
  [`${NAMESPACE}Product__r`]: 'product',
  [`${NAMESPACE}IsActive__c`]: 'isActive',
};

const ITEMS_ON_PAGE = 13;

const ManageLots = ({ navigation }) => {
  const [refreshWidget, refreshWidgetActions] = useBoolean(false);
  const [showActive, showActiveActions] = useBoolean(true);
  const [banner, setBanner] = useBanner();

  const theme = useTheme();

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

  const borderColor = theme.dark
    ? color(theme.colors.background).lighten(0.7).hex()
    : color(theme.colors.background).darken(0.1).hex();

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
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
        ItemSeparatorComponent={() => <View style={[styles.separator, { borderBottomColor: borderColor }]} />}
        renderItem={({ item, i }) => (
          <LotItem
            item={item}
            style={styles.item}
            handleStatusChange={status => handleStatusChange(status, item.id)}
          />
        )}
        onEndReached={(e) => {
          if (e?.distanceFromEnd < 0) return;
          handleLoadMore();
        }}
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
    borderBottomWidth: 1,
  },
  item: {
    marginBottom: 0,
    paddingTop: 10,
    paddingBottom: 5,
  },
});

export default ManageLots;
