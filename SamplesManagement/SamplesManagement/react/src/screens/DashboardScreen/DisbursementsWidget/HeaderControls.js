import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { useBoolean, useHandleData } from '../../../hooks';
import {
  Select,
  IconButton,
  Checkbox,
  Search,
  Menu,
  themeGrey,
} from 'apollo-react-native';

const HeaderControls = ({
  items,
  period,
  setPeriod,
  disbursements,
  filtered,
  setFilter,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [filterVisible, setFilterActions] = useBoolean(false);
  return (
    <View style={styles.root}>
      <Select
        options={items}
        value={period}
        onChange={val => setPeriod(val)}
        width={145}
        hideDropdownPlaceholder
        size="small"
      />
      <View style={{ paddingRight: 10 }}>
        {useHandleData(disbursements)(data => (
          <Menu
            visible={filterVisible}
            onDismiss={() => setFilterActions.setFalse()}
            anchor={
              <IconButton
                size={20}
                icon="filter"
                onPress={() => setFilterActions.toggle(!filterVisible)}
                disabled={!data.allIds.length}
                color={themeGrey[700]}
                style={{ right: -10 }}
              />
            }
          >
            <View style={styles.dropdown}>
              <Search
                placeholder="Search"
                value={searchValue}
                style={styles.search}
                onChangeText={text => setSearchValue(text)}
              />
              <ScrollView>
                {data.allIds
                  .filter(id =>
                    data.byId[id].label
                      .toLocaleLowerCase()
                      .includes(searchValue.toLocaleLowerCase())
                  )
                  .map((id, i) => (
                    <View
                      key={id}
                      style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                      <View
                        style={{
                          position: 'absolute',
                          borderRadius: 3,
                          left: 37,
                          width: 19,
                          height: 19,
                          backgroundColor: disbursements.data.colors[i],
                          marginRight: 10,
                        }}
                      />
                      <Checkbox
                        status={
                          filtered.includes(id) ? 'checked' : 'determinate'
                        }
                        onChange={() => setFilter(id)}
                        value={id}
                      />
                      <Text
                        style={[
                          { marginLeft: 28, fontSize: 16 },
                          filtered.includes(id) && { fontWeight: 'bold' },
                        ]}
                      >
                        {data.byId[id].label}
                      </Text>
                    </View>
                  ))}
              </ScrollView>
            </View>
          </Menu>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    flexWrap: 'wrap',
  },
  dropdown: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: 300,
  },
  search: {
    marginBottom: 10,
  },
});

export default HeaderControls;
