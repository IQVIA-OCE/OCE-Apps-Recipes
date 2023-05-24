import React from 'react';
import { StyleSheet } from 'react-native';
import Card from '../../Card/Card';
import { useSelector } from 'react-redux';
import { meetingSelector } from '../../../store/meetingSlice/meetingSelectors';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { CURRENCIES } from '../../../constants/currencies';
import { Text, useTheme } from 'apollo-react-native';

const EstimatedCostWidget = () => {
  const theme = useTheme();
  const { estimatedBudget, currencyISOCode } = useSelector(meetingSelector);

  return (
    <Card icon="cash-multiple" title="Estimated cost" testID="EstimatedCost_widget">
      {Boolean(estimatedBudget) ? (
        <>
          <Text style={styles.cost}>
            {CURRENCIES[currencyISOCode] || currencyISOCode} {estimatedBudget}
          </Text>
          <Text style={styles.currency}>{currencyISOCode}</Text>
        </>
      ) : (
        <>
          <Icon style={styles.errorIcon} size={22} name="alert" color={theme.colors.text} />
          <Text style={styles.errorText}>You have no added any expenses</Text>
        </>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  cost: {
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 5,
  },
  currency: {
    fontSize: 17,
  },
  errorIcon: {
    marginBottom: 8,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  errorText: {
    textAlign: 'center',
  },
});

export default EstimatedCostWidget;
