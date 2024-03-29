import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, useTheme } from '@oce-apps/apollo-react-native';
import { useBoolean, useHandleData } from '../../../hooks';
import {
  Select,
  IconButton,
  Checkbox,
  Search,
  Menu,
} from '@oce-apps/apollo-react-native';

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
  const theme = useTheme();

  return (
    <View style={styles.root}>
      <Select
        options={items}
        value={period}
        onChange={val => setPeriod(prevVal => (val === null ? prevVal : val))}
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
                color={theme.colors.tertiary}
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
