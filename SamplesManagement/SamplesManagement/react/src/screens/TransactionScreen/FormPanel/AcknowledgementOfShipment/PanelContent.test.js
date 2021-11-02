import React from 'react';
import PanelContent from './PanelContent';
import { Formik } from 'formik';
import renderer, { act } from 'react-test-renderer';
import DateField from '../DateField';
import { Select } from 'apollo-react-native';
import { getValidationSchema } from '../../validationSchema';

describe('PanelContent', () => {
  it('should render properly', () => {
    let tree = renderer.create(
      <Formik
        initialValues={{
          fields: {
            conditionOfPackage: '',
            receivedDate: '',
            comments: '',
          },
        }}
      >
        <PanelContent />
      </Formik>
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should render errors', async () => {
    const promise = Promise.resolve();
    const mockSubmit = jest.fn();
    const Component = () => (
      <Formik
        initialValues={{
          fields: {
            conditionOfPackage: '',
            receivedDate: '',
            comments: '',
          },
        }}
        onSubmit={mockSubmit}
        validate={() => ({
          fields: {
            conditionOfPackage: 'error',
            receivedDate: 'error',
            comments: 'error',
          },
        })}
      >
        <PanelContent />
      </Formik>
    );
    let tree = renderer.create(<Component />);

    await act(async () =>
      tree.root.findByType(DateField).props.onChange('asdf')
    );
    await act(async () => tree.root.findByType(Select).props.onChange('asdf'));
    await act(async () => tree.root.findByType(Formik).props.onSubmit());
    act(() => tree.update(<Component />));
    await act(async () => promise);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
