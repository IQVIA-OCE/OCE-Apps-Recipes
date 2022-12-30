import React from 'react';
import PanelContent from './PanelContent';
import { Formik } from 'formik';
import renderer, { act } from 'react-test-renderer';
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

  it('should call Input onchange', async () => {
    const promise = Promise.resolve();
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

    act(() => {
        tree.root.findByType(TextInput).props.onChangeText('test');
    })
    await act(() => promise);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
