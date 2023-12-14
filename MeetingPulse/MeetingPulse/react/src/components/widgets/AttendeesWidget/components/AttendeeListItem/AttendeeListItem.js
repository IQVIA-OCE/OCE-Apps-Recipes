import React from 'react';
import { View, StyleSheet } from 'react-native';
import { isIphone } from '../../../../../utils/helpers';
import { Text } from 'apollo-react-native';

const AttendeeListItem = ({ title, subtitle, avatarText, avatarColor, email }) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
          <Text style={styles.avatarText}>{avatarText}</Text>
        </View>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text>{subtitle}</Text>
        </View>
      </View>
      {email && (
        <Text numberOfLines={1} ellipsizeMode="tail">
          {email}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    marginLeft: -10
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
    width: isIphone ? 30 : 40,
    height: isIphone ? 30 : 40,
    borderRadius: isIphone ? 15 : 20,
    marginRight: 10,
  },
  avatarText: {
    color: '#fff',
    fontSize: isIphone? 16 : 20,
    fontWeight: 'bold',
  },
  title: {
    fontSize: isIphone ? 14 : 16,
    fontWeight: '500',
  },
});

export default AttendeeListItem;
