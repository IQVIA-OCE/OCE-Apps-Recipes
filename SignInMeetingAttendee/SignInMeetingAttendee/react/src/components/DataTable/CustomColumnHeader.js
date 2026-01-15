

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Title } from '@oce-apps/apollo-react-native';

const CustomColumnHeader = (title) => { return (<View><Title style={styles.columnHeader}>{title}</Title></View>) }
export default CustomColumnHeader;

const styles = StyleSheet.create({
    columnHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 0,
        paddingBottom: 30

    }

});
