import React, { useEffect, useCallback } from 'react';
import { neutral05, neutral06 } from '@oce-apps/apollo-react-native';
import { StyleSheet, View } from 'react-native';
import { Cell } from '../../components/Cell/Cell'

export const RowGrid = ({ primaryAccessor, primaryValue, secondaryAccessor, secondaryValue, isSecondary, ...props }) => {

    return (
        <View style={styles.row} {...props} testID={'rowGridContainer'}>
            <Cell
                style={styles.cell}
                accessor={primaryAccessor}
                value={primaryValue}
                accessorStyle={{ color: neutral06[300] }}
                valueStyle={{ color: '#fff', fontWeight: '500' }}
                testID={`firstCellContainer`}
            />
            {isSecondary && <Cell
                style={styles.cell}
                accessorStyle={{ color: neutral06[300] }}
                valueStyle={{ color: '#fff', fontWeight: '500' }}
                accessor={secondaryAccessor}
                value={secondaryValue}
                testID={`secondCellContainer`}
            />}
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row', flex: 1
    },
    cell: {
        padding: 10
    }
});
