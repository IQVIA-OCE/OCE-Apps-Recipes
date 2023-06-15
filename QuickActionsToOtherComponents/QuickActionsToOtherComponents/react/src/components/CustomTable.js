import {
  Accordion,
  Badge,
  Button,
  Divider,
  Table,
  Text,
  useTheme,
} from 'apollo-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { isIphone } from '../utils';

const ROWS_PER_PAGE = 3;

export const CustomTable = ({
  title,
  totalSize,
  columns,
  rows,
  initialSortedColumn,
  initialSortOrder,
  columnWidth,
  hidePagination,
  icon,
  onPressButton,
  disableButton,
  ...props
}) => {
  const theme = useTheme();
  const tableStyles = {
    headerStyles: {
      containerStyle: styles.tableHeaderContainer,
    },
    headerCellStyles: {
      textStyle: styles.tableHeaderCellText,
    },
  };

  return (
    <View {...props}>
      <Accordion>
        <Accordion.Summary
          title={
            <View style={styles.titleContainer}>
              <Icon
                name={icon}
                size={24}
                color={theme.colors.primary}
                style={styles.titleIcon}
              />
              <Badge
                badgeContent={totalSize}
                badgeContentStyle={styles.titleBadgeText}
                style={styles.titleBadge}
              >
                <View>
                  <Text style={styles.titleText}>{title}</Text>
                </View>
              </Badge>
            </View>
          }
          rightContent={
            <Button
              onPress={onPressButton}
              mode="contained"
              icon="plus"
              size="small"
              disabled={disableButton}
            >
              New
            </Button>
          }
        />
        <Accordion.Details>
          <View
            style={[styles.tableContainer, { height: isIphone ? 445 : 265 }]}
          >
            <Table
              style={tableStyles}
              columns={columns}
              rows={rows}
              initialSortedColumn={initialSortedColumn}
              initialSortOrder={initialSortOrder}
              columnWidth={columnWidth}
              rowsPerPageOptions={[ROWS_PER_PAGE]}
              hidePagination={hidePagination}
              phoneProps={{ columnsNumber: 1 }}
              inlinePagination
              stripedRows
            />
          </View>
        </Accordion.Details>
      </Accordion>
      <Divider />
    </View>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleIcon: {
    paddingRight: 15,
  },
  titleBadge: {
    top: 0,
    right: -30,
    height: 24,
    width: 'auto',
    minWidth: 24,
    borderRadius: 12,
  },
  titleBadgeText: {
    fontSize: 18,
    lineHeight: 24,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '500',
  },
  tableContainer: {
    paddingVertical: 10,
  },
  tableHeaderContainer: {
    height: 0,
    minHeight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    opacity: 0,
  },
  tableHeaderCellText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
