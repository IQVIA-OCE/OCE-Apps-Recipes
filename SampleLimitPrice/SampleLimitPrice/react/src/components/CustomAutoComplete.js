import React, { useEffect, useState } from 'react';
import { FlatList, View, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import { Divider, Search, Text, useTheme } from 'apollo-react-native';
import color from 'color'

const CustomAutoComplete = ({ data, searchItemByQuery, defaultVal, label, isVisible, toggleListActive, onSelectItem }) => {
    const [searchVal, setSearchVal] = useState(defaultVal);
    const theme = useTheme();
    useEffect(() => {
        setSearchVal(defaultVal);
    }, [defaultVal])
    const renderSeperator = () => <Divider type="axis" style={styles.divider} />
    const searchFilterFunction = (text) => {
        if (!searchVal?.label) toggleListActive(true)
        setSearchVal(text);
        searchItemByQuery(text);

    };
    const handleInputFocus = () => {
        toggleListActive(true);
    }
    const onSelect = (item) => {
        Keyboard.dismiss();
        onSelectItem(item);
        setSearchVal(item);
        toggleListActive(false);
    }
    const onClearValue = () => {
        onSelectItem('');
        setSearchVal('');
    }
    return (
        <View style={[styles.container, {
            backgroundColor: theme.dark ? theme.colors.background : color(theme.colors.background).lighten(1).hex()
        }]}>
            <View style={styles.inputRow}>
                <View style={[styles.search]}>
                    <Search
                        style={{
                            backgroundColor: theme.dark ? theme.colors.background : color(theme.colors.background).lighten(1).hex()
                        }}
                        onChangeText={text => searchFilterFunction(text)}
                        onFocus={handleInputFocus}
                        value={searchVal ? searchVal.label : searchVal}
                        label={label}
                        placeholder={'Search Accounts'}
                        clearIcon={'close'}
                        onIconPress={onClearValue}
                    />
                    {isVisible && <View>
                        <View style={[styles.flatlistContainer, {
                            backgroundColor: theme.dark ? color(theme.colors.surface).darken(0.4).hex() : '#fff',
                            shadowColor: theme.dark ? color(theme.colors.background).lighten(1).hex() : '#000'
                        }]}>
                            <FlatList
                                data={data}
                                renderItem={({ item }) => (
                                    <TouchableOpacity onPress={() => onSelect(item)}>
                                        <Text style={styles.item}>{item.label}</Text>
                                    </TouchableOpacity>
                                )}
                                keyExtractor={item => item.value}
                                ItemSeparatorComponent={renderSeperator}
                            />
                        </View>
                    </View>
                    }
                </View>
            </View>
        </View >
    );
}

export default CustomAutoComplete;

export const styles = StyleSheet.create({
    container: {
        minWidth: '100%',
        borderRadius: 3
    },
    search: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flex: 1,
        marginBottom: 50
    },
    textInput: {
        width: '100%',
        borderWidth: 1,
        borderColor: 'blue'
    },
    flatlistContainer: {
        position: 'absolute',
        maxHeight: 180,
        width: '100%',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        backgroundColor: '#fff',
        flexGrow: 0,
        zIndex: 1
    },
    inputRow: {
        display: 'flex',
        flexDirection: 'row',
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 5
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    buttonText: {
        alignSelf: 'flex-start',
        fontSize: 13,
        margin: 0,
        padding: 5
    },
    item: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center'
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    }
});
