import React  from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import Status from '../Status/Status';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { secondaryGreen, themeGrey, black  } from 'apollo-react-native';

const ProductListItem = ({ item, onPress }) => {
  const handleOnPress = () => {
    if (item.locked || item.selected) return;

    if (typeof onPress === 'function') {
      onPress(item);
    }
  };

  return (
    <TouchableOpacity onPress={handleOnPress}>
      <View style={styles.listItem}>
        <View>
          <Text style={styles.itemTitle}>{item.label}</Text>
          <Status status="Info" size="large" text={item.detailLabel} />
        </View>
        <View>
          {(item.locked || item.selected) && (
            <Icon
              name="check"
              size={20}
              color={
                item.locked
                  ? themeGrey[900]
                  : secondaryGreen[900]
              }
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: themeGrey[200],
    paddingVertical: 10,
  },
  itemTitle: {
    marginBottom: 5,
    marginLeft: 5,
    color: black[300],
  },
});

export default ProductListItem;
