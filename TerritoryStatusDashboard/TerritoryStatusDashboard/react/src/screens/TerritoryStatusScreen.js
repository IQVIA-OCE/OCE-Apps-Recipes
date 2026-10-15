import { ApolloProgress, Caption, Title, useTheme } from '@oce-apps/apollo-react-native';
import color from 'color';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Group } from '../components/Group';
import { DATA_FETCHING_PERIOD, LOADING_STATUS } from '../constants';
import { collectedDataSelector, loadingStatusSelector } from '../store/territoryStatus/territoryStatusSelectors';
import { bootstrap } from '../store/territoryStatus/territoryStatusSlice';
import { getDataToDisplay, isMobilePhone, isWeb } from '../utils';

const CAPTION_MARGIN = 30;
const GROUP_BORDER_WIDTH = 2;
const GROUP_PADDING = 20;

export const TerritoryStatusScreen = ({ ...props }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const collectedData = useSelector(collectedDataSelector);
  const loadingStatus = useSelector(loadingStatusSelector);
  const isLoading = loadingStatus === LOADING_STATUS.PENDING;

  useEffect(() => {
    dispatch(bootstrap());
  }, []);

  const groupsList = getDataToDisplay(collectedData);

  if (isLoading) {
    return (
      <View style={[styles.loader, { backgroundColor: color(theme.colors.surface).alpha(0.8).string() }]}>
        <ApolloProgress />
      </View>
    );
  }

  return (
    <View {...props} style={isWeb ? [styles.wrapperWeb, { backgroundColor: theme.colors.surface }] : styles.wrapperIOS}>
      <View
        style={isMobilePhone ? styles.titleContainerVerticalLayout : styles.titleContainerHorizontalLayout}
      >
        <Title style={styles.title}>Territory Status</Title>
        <Caption
          style={{
            marginLeft: isMobilePhone ? 0 : CAPTION_MARGIN,
            color: theme.colors.tertiary,
          }}
        >
          {`*Data related to the past ${DATA_FETCHING_PERIOD} days`}
        </Caption>
      </View>
      <View
        style={isMobilePhone ? styles.groupsContainerVerticalLayout : styles.groupsContainerHorizontalLayout}
      >
        {groupsList.map(
          ({ name, subgroups }, index) => (
            <Group
              key={index}
              title={name}
              subgroups={subgroups}
              style={{
                width: isMobilePhone ? '100%' : `${100 / groupsList.length}%`,
                borderRightWidth: index < groupsList.length - 1 && !isMobilePhone ? GROUP_BORDER_WIDTH : 0,
                borderBottomWidth: index < groupsList.length - 1 && isMobilePhone ? GROUP_BORDER_WIDTH : 0,
                paddingLeft: isMobilePhone || index === 0 ? 0 : GROUP_PADDING,
                paddingRight: isMobilePhone || index === groupsList.length - 1 ? 0 : GROUP_PADDING,
              }}
            />
          ),
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapperIOS: {
    flex: 1,
    padding: 10,
  },
  wrapperWeb: {
    flex: 1,
    padding: 20,
    borderRadius: 10,
  },
  loader: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainerVerticalLayout: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  titleContainerHorizontalLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 24,
  },
  groupsContainerVerticalLayout: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  groupsContainerHorizontalLayout: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
