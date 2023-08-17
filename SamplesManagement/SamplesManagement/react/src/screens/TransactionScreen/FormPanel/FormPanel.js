import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import FormDetailsTitle from '../../../components/FormDetailsTitle/FormDetailsTitle';

import AOSPanelHeader from './AcknowledgementOfShipment/PanelHeader';
import AOSPanelContent from './AcknowledgementOfShipment/PanelContent';

import ReturnPanelHeader from './Return/PanelHeader';
import ReturnPanelContent from './Return/PanelContent';

import AdjustmentPanelHeader from './Adjustment/PanelHeader';
import AdjustmentPanelContent from './Adjustment/PanelContent';

import TransferInPanelHeader from './TransferIn/PanelHeader';
import TransferInPanelContent from './TransferIn/PanelContent';

import TransferOutPanelHeader from './TransferOut/PanelHeader';
import TransferOutPanelContent from './TransferOut/PanelContent';
import { useTheme } from 'apollo-react-native';

const FormPanel = ({ recordType, readonly }) => {
  const theme = useTheme();

  const renderHeader = useCallback(() => {
    switch (recordType) {
      case 'AcknowledgementOfShipment':
        return <AOSPanelHeader readonly={readonly}/>;
      case 'Adjustment':
        return <AdjustmentPanelHeader readonly={readonly}/>;
      case 'Return':
        return <ReturnPanelHeader readonly={readonly}/>;
      case 'TransferIn':
        return <TransferInPanelHeader readonly={readonly}/>;
      case 'TransferOut':
        return <TransferOutPanelHeader readonly={readonly}/>;
      default:
        return;
    }
  });

  const renderContent = useCallback(() => {
    switch (recordType) {
      case 'AcknowledgementOfShipment':
        return <AOSPanelContent readonly={readonly}/>;
      case 'Adjustment':
        return <AdjustmentPanelContent readonly={readonly}/>;
      case 'Return':
        return <ReturnPanelContent readonly={readonly}/>;
      case 'TransferIn':
        return <TransferInPanelContent readonly={readonly}/>;
      case 'TransferOut':
        return <TransferOutPanelContent readonly={readonly}/>;
      default:
        return;
    }
  });

  return (
    <>
      {renderHeader()}
      <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.title}>
          <FormDetailsTitle title="ADDITIONAL INFORMATION" />
        </View>
        {renderContent()}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
  },
  title: {
    paddingHorizontal: 15,
  },
});

export default FormPanel;
