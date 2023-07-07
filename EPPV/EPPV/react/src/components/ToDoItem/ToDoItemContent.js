import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { Cell } from '../Cell/Cell';
import { neutral05, useTheme, IconButton } from 'apollo-react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import color from 'color';
import { formatDate, isIphone } from '../../utils';

export const ToDoItemContent = ({ item, index, onComplete, openRight }) => {
    const theme = useTheme();

    return (<View style={{ flex: 1 }}>
      <View style={styles.row} testID={`listItemContainer_${index}`}>
        {isIphone ? (
          <>
            <Cell
              style={{
                backgroundColor: theme.dark
                  ? color(theme.colors.surface).darken(0.3).hex()
                  : '#f6f7f8',
              }}
              data={[
                { value: item.compliance, label: 'Compliance' },
                { value: item.accountName, label: 'Account Name' },
              ]}
              testID={`userName_${index}`}
              labelStyle={[
                styles.customLabelStyle,
                {
                  color: theme.dark
                    ? color(neutral05[500]).lighten(0.1).hex()
                    : neutral05[500],
                },
              ]}
            />
            <Cell
              style={{
                backgroundColor: theme.dark
                  ? color(theme.colors.surface).darken(0.5).hex()
                  : 'white',
              }}
              data={[
                { value: item.cycle, label: 'Cycle' },
                {
                  value: formatDate(item.cycleStartdate),
                  label: 'Cycle Start Date',
                },
                {
                  value: formatDate(item.cycleEndDate),
                  label: 'Cycle End Date',
                },
              ]}
              labelStyle={[
                styles.customLabelStyle,
                {
                  color: theme.dark
                    ? color(neutral05[500]).lighten(0.1).hex()
                    : neutral05[500],
                },
              ]}
              testID={`cycleField_${index}`}
            />
          </>
        ) : (
          <>
            <Cell
              style={{
                backgroundColor: theme.dark
                  ? color(theme.colors.surface).darken(0.3).hex()
                  : '#f6f7f8',
              }}
              data={[{ value: item.compliance, label: 'Compliance' }]}
              testID={`userName_${index}`}
              labelStyle={[
                styles.customLabelStyle,
                {
                  color: theme.dark
                    ? color(neutral05[500]).lighten(0.1).hex()
                    : neutral05[500],
                },
              ]}
            />
            <Cell
              style={{
                backgroundColor: theme.dark
                  ? color(theme.colors.surface).darken(0.3).hex()
                  : '#f6f7f8',
              }}
              data={[{ value: item.accountName, label: 'Account Name' }]}
              testID={`accountName_${index}`}
              labelStyle={[
                styles.customLabelStyle,
                {
                  color: theme.dark
                    ? color(neutral05[500]).lighten(0.1).hex()
                    : neutral05[500],
                },
              ]}
            />
            <Cell
              style={{
                backgroundColor: theme.dark
                  ? color(theme.colors.surface).darken(0.5).hex()
                  : 'white',
              }}
              data={[{ value: item.cycle, label: 'Cycle' }]}
              labelStyle={[
                styles.customLabelStyle,
                {
                  color: theme.dark
                    ? color(neutral05[500]).lighten(0.1).hex()
                    : neutral05[500],
                },
              ]}
              testID={`cycleField_${index}`}
            />
            <Cell
              style={{
                backgroundColor: theme.dark
                  ? color(theme.colors.surface).darken(0.5).hex()
                  : 'white',
              }}
              data={[
                {
                  value: formatDate(item.cycleStartdate),
                  label: 'Cycle Start Date',
                },
              ]}
              labelStyle={[
                styles.customLabelStyle,
                {
                  color: theme.dark
                    ? color(neutral05[500]).lighten(0.1).hex()
                    : neutral05[500],
                },
              ]}
              testID={`cycleStartdate_${index}`}
            />
            <Cell
              style={{
                backgroundColor: theme.dark
                  ? color(theme.colors.surface).darken(0.5).hex()
                  : 'white',
              }}
              data={[
                {
                  value: formatDate(item.cycleEndDate),
                  label: 'Cycle End Date',
                },
              ]}
              labelStyle={[
                styles.customLabelStyle,
                {
                  color: theme.dark
                    ? color(neutral05[500]).lighten(0.1).hex()
                    : neutral05[500],
                },
              ]}
              testID={`cycleEndtdate_${index}`}
            />
          </>
        )}

        {Platform.OS === 'web' ? (
          <View
            style={{
              alignContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
            }}
          >
            <IconButton
              icon="pencil"
              color={'#33b2fe'}
              size={30}
              onPress={() => onComplete(item)}
              testID={'complete_web_button'}
            />
          </View>
        ) : (
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: theme.dark
                  ? color(theme.colors.surface).darken(0.5).hex()
                  : 'white',
              },
            ]}
            testID={`swipeBtn_${index}`}
          >
            <MaterialIcon
              name="dots-vertical"
              color={neutral05[200]}
              size={28}
              testID={`swipeIcon_${index}`}
              onPress={openRight}
            />
          </View>
        )}
      </View>
    </View>)
  }


  const styles = StyleSheet.create({
    row: {
      flexDirection: 'row',
    },
    customLabelStyle: {
      color: neutral05[500],
      marginBottom: 5,
      fontWeight: '400',
    },
    iconContainer: {
      paddingHorizontal: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cellContainer: {
      flexDirection: 'row',
      alignContent: 'center',
      flex: 1,
    },
    accrodianContent: {
      flexDirection: 'row',
      backgroundColor: '#f6f7f8',
      alignItems: 'flex-start',
    },
  });