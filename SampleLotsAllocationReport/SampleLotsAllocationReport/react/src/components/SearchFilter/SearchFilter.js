import React, { useEffect, useState } from "react";
import { StyleSheet, View, } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { Select } from '@oce-apps/apollo-react-native';
import { SearchInput } from '../../components/SearchInput/SearchInput';
import { setSearchQuery, setSearchField } from '../../store/Search/SearchSlice';
import { searchFieldSelector, searchQuerySelector } from "../../store/Search/SearchSelector";

export const SearchFilter = ({ onClear, searchOptions, isLoading }) => {
    const dispatch = useDispatch();
    const searchField = useSelector(searchFieldSelector);
    const searchQuery = useSelector(searchQuerySelector);
    const [selectedSearchField, setSelectedSearchField] = useState();
    const onSearch = (value) => {
        dispatch(setSearchQuery(value));
    };
    useEffect(() => {
        const [selectedItem] = searchOptions.filter((option) => option.value === searchField)
        setSelectedSearchField(selectedItem);
    }, [searchField])
    useEffect(() => {
        setSelectedSearchField({ label: 'Product', value: 'product' });
        dispatch(setSearchField('product'))
    }, [searchOptions])
    const onIconPress = () => {
        onSearch('');
        onClear();
    }
    const filterByProduct = (obj) => {
        setSelectedSearchField(obj);
        dispatch(setSearchField(obj?.value))
    }
    return (
        <View style={styles.filterContainer}>
            <View style={styles.searchInput} testID="searchContainer">
                <SearchInput searchQuery={searchQuery} isLoading={isLoading} onSearch={onSearch} onIconPress={onIconPress} />
            </View>
            <View style={styles.select} testID="productfilterContainer">
                <Select
                    label={'Search By'}
                    options={searchOptions}
                    value={selectedSearchField}
                    onChange={(val) => filterByProduct(val)}
                    width={260}
                />
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    filterContainer: {
        flexDirection: 'row',
        paddingVertical: 10,
        alignItems: 'center',
        marginTop: 10

    },
    searchInput: {
        maxWidth: 400,
    },
    select: {
        marginLeft: 30
    }
});
