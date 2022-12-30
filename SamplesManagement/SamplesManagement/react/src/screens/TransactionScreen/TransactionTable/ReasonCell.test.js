import React from 'react';
import renderer, { act } from 'react-test-renderer';
import ReasonCell from './ReasonCell';
import { FieldArray, Formik } from 'formik';
import { Select } from 'apollo-react-native';

const Component = () => (
  <Formik initialValues={{ products: [{ Id: '1', comments: '' }] }}>
    {() => (
      <FieldArray name="products">
        {props => <ReasonCell row={{ Id: '1' }} {...props} />}
      </FieldArray>
    )}
  </Formik>
);

describe('ReasonCell', () => {
  it('should render properly', async () => {
    let tree;
    act(() => {
      tree = renderer.create(<Component />);
    });

    act(() => {
      tree.root.findByType(Select).props.onChange({ id: '1', label: '1' });
    });

    expect(tree.toJSON()).toMatchSnapshot();
    act(() => {
      tree.update(<Component />);
    });

    expect(tree.toJSON()).toMatchSnapshot();
    act(() => {
      tree.update();
    });
  });
});
