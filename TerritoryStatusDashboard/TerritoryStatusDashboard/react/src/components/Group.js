import { Title, useTheme } from '@oce-apps/apollo-react-native';
import color from 'color';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { GroupItem } from './GroupItem';

const SUBGROUP_PADDING = 20;

export const Group = ({
  title,
  subgroups = [],
  style,
  ...props
}) => {
  const theme = useTheme();
  const borderColor = theme.dark
    ? color(theme.colors.tertiary).darken(0.3).hex()
    : color(theme.colors.tertiary).lighten(0.999).hex();

  return (
    <View
      {...props}
      style={[
        styles.groupContainer,
        { borderColor: borderColor },
        style,
      ]}
    >
      <Title>{title}</Title>
      {subgroups.map(({ iconName, items }, subgroupIndex) => (
        <View
          key={subgroupIndex}
          style={[styles.subgroup, { marginBottom: subgroupIndex < subgroups.length - 1 ? SUBGROUP_PADDING : 0 }]}
        >
          <Icon
            name={iconName}
            size={30}
            color={theme.colors.primary}
            style={styles.icon}
          />
          <FlatList
            data={items}
            renderItem={({ item, index }) => (
              <GroupItem key={index} item={item} />
            )}
            ItemSeparatorComponent={() => (
              <View style={[styles.separator, { borderBottomColor: borderColor }]}></View>
            )}
            scrollEnabled={false}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  groupContainer: {
    paddingTop: 15,
    paddingBottom: 15,
    borderStyle: 'solid',
    borderWidth: 0,
  },
  subgroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    paddingRight: 10,
  },
  separator: {
    borderBottomWidth: 1,
  },
});
