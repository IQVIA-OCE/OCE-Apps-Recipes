import React from 'react';
import PanelContent from './PanelContent';
import { Formik } from 'formik';
import renderer from 'react-test-renderer';
import { TextInput } from 'apollo-react-native';

describe('PanelContent', () => {
  it('should render properly', () => {
    let tree = renderer.create(
      <Formik
        initialValues={{
          fields: {
            comments: '',
          },
        }}
      >
        <PanelContent />
      </Formik>
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call Input onchange', () => {
    let tree = renderer.create(
      <Formik
        initialValues={{
          fields: {
            comments: '',
          },
        }}
      >
        <PanelContent />
      </Formik>
    );

    tree.root.findByType(TextInput).props.onChangeText('test');
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
