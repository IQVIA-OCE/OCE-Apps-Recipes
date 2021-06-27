import React from 'react';
import PanelContent from './PanelContent';
import { Formik } from 'formik';
import renderer from 'react-test-renderer';
import { TextInput } from 'apollo-react-native';
import DateField from '../DateField';

describe('PanelContent', () => {
  it('should render properly', () => {
    let tree = renderer.create(
      <Formik
        initialValues={{
          shipmentCarrier: '',
          comments: '',
          fields: {
            shipmentDate: '',
            trackingNumber: '',
          },
        }}
      >
        <PanelContent />
      </Formik>
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call DateField onChange', () => {
    let tree = renderer.create(
      <Formik
        initialValues={{
          shipmentCarrier: '',
          comments: '',
          fields: {
            shipmentDate: '',
            trackingNumber: '',
          },
        }}
      >
        <PanelContent />
      </Formik>
    );

    tree.root.findByType(DateField).props.onChange('test');
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call TextInputs onChange', () => {
    let tree = renderer.create(
      <Formik
        initialValues={{
          shipmentCarrier: '',
          comments: '',
          fields: {
            shipmentDate: '',
            trackingNumber: '',
          },
        }}
      >
        <PanelContent />
      </Formik>
    );

    tree.root.findAllByType(TextInput).forEach(el => {
      if (el.props.onChangeText) {
        el.props.onChangeText('test')
      }
    });

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
