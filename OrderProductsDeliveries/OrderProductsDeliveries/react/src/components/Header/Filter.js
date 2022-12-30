

import React from "react";
import { View, StyleSheet } from "react-native";
import { Select } from 'apollo-react-native';
import { useSelector, useDispatch } from "react-redux";
import { setBrandFilterValue } from "../../stores/orders";

export default () => {

    const dispatch = useDispatch();
    const brandsOptions = useSelector((state) => state.ordersListReducers.brandOptions);
    const brandFilterValue = useSelector((state) => state.ordersListReducers.brandFilter);
    
    return (
        <View style={styles.content} testID="filterWrapper">
            <Select
                options={brandsOptions}
                value={brandFilterValue}
                onChange={val => dispatch(setBrandFilterValue(val.value === 'none' ? null : val))}
                placeholder="Brand"
                width={'100%'}
                disabled={brandsOptions.length ? false : true}
                hideDropdownPlaceholder={true}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    content: {
        width: 300
    },
});