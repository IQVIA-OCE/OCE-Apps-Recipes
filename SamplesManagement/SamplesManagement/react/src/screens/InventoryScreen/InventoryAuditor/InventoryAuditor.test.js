import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { Formik } from 'formik';
import InventoryAuditor from './InventoryAuditor';
import { PortalConsumer, Provider, Search, Menu } from 'apollo-react-native';
import { InventoryContext } from '../InventoryContext';
import { INVENTORY_FORM_TYPE } from '../../../constants/Inventories';
import { fetchAuditorById, fetchAuditors } from '../../../api/Inventories';

jest.mock('../../../api/Inventories');
jest.mock('../../../../bridge/EnvironmentData/EnvironmentData.native');

const Component = ({ editingType, auditor }) => (
  <Provider>
    <InventoryContext.Provider
      value={{
        editingType,
      }}
    >
      <Formik
        initialValues={{
          auditor,
          id: '123',
          status: 'Saved',
          products: [{ id: '1' }],
        }}
      >
        <InventoryAuditor />
      </Formik>
    </InventoryContext.Provider>
  </Provider>
);

describe('InventoryAuditor', () => {
  beforeAll(() => {
    jest.useFakeTimers();

    fetchAuditors.mockReturnValue([[{ Id: 'Id', Name: 'Name' }]]);
    fetchAuditorById.mockReturnValue([[{ Id: 'Id', Name: 'Name' }]]);
  });
  afterAll(() => {
    jest.useRealTimers();
  });
  it('should render properly', async () => {
    const promise = Promise.resolve();
    let tree;

    act(() => {
      tree = renderer.create(
        <Component editingType={INVENTORY_FORM_TYPE.edit} />
      );
    });

    act(() => {
      tree.root.findByType(Search).props.onIconPress();
    });

    act(() => {
      tree.root.findByType(Search).props.onChangeText('some text');
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(tree.toJSON()).toMatchSnapshot();
    await act(() => promise);
  });

  it('should render readonly component', async () => {
    const promise = Promise.resolve();
    let tree;

    act(() => {
      tree = renderer.create(
        <Component editingType={INVENTORY_FORM_TYPE.editSaved} auditor="Id" />
      );
    });
    await act(() => promise);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
