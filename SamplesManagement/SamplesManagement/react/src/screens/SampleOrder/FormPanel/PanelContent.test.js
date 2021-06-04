import React from 'react';
import PanelContent from './PanelContent';
import { Formik } from 'formik';
import renderer, { act } from 'react-test-renderer';
import { useFetcher, useHandleData } from '../../../hooks';

jest.mock('../../../hooks');

describe('PanelContent', () => {
  beforeEach(() => {
    useFetcher.mockReturnValue([
      {
        data: [],
        loading: false,
      },
      { handleFetch: jest.fn() },
    ]);

    useHandleData.mockImplementation(({ data }) => fn => fn(data));
  });
  it('should render properly', () => {
    let tree = renderer.create(
      <Formik
        initialValues={{
          fields: {
            shipTo: '',
            comments: '',
          },
        }}
      >
        <PanelContent readonly={false}/>
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
            shipTo: '',
            comments: '',
          },
        }}
        onSubmit={mockSubmit}
        validate={() => ({
          fields: {
            shipTo: 'error',
            comments: 'error',
          },
        })}
      >
        <PanelContent />
      </Formik>
    );
    let tree = renderer.create(<Component />);

    await act(async () => tree.root.findByType(Formik).props.onSubmit());
    act(() => tree.update(<Component />));
    await act(async () => promise);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
