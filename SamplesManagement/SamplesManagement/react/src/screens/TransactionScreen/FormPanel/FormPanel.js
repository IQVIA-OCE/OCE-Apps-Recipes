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

const FormPanel = ({ recordType }) => {
  const renderHeader = useCallback(() => {
    switch (recordType) {
      case 'AcknowledgementOfShipment':
        return <AOSPanelHeader />;
      case 'Adjustment':
        return <AdjustmentPanelHeader />;
      case 'Return':
        return <ReturnPanelHeader />;
      case 'TransferIn':
        return <TransferInPanelHeader />;
      case 'TransferOut':
        return <TransferOutPanelHeader />;
      default:
        return;
    }
  }, []);

  const renderContent = useCallback(() => {
    switch (recordType) {
      case 'AcknowledgementOfShipment':
        return <AOSPanelContent />;
      case 'Adjustment':
        return <AdjustmentPanelContent />;
      case 'Return':
        return <ReturnPanelContent />;
      case 'TransferIn':
        return <TransferInPanelContent />;
      case 'TransferOut':
        return <TransferOutPanelContent />;
      default:
        return;
    }
  }, []);

  return (
    <>
      {renderHeader()}
      <View style={styles.container}>
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
