import React from 'react';
import { Formik } from 'formik';
import InventoryAuditor from './InventoryAuditor';
import { PortalConsumer, Provider, Search, Menu } from 'apollo-react-native';
import { InventoryContext } from '../InventoryContext';
import { INVENTORY_FORM_TYPE } from '../../../constants/Inventories';
import { fetchAuditorById, fetchAuditors } from '../../../api/Inventories';
import { render, act, waitFor } from '@testing-library/react-native';

jest.mock('../../../api/Inventories');

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
    const { container, getByText } = render(
      <Component editingType={INVENTORY_FORM_TYPE.edit} />
    );
    const promise = Promise.resolve();

    act(() => {
      container.findByType(Search).props.onIconPress();
    });

    act(() => {
      container.findByType(Search).props.onChangeText('some text');
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    await act(() => promise);

    await expect(getByText(/Name/)).toBeTruthy();
  });

  it('should render readonly component', async () => {
    const { getByText } = render(<Component editingType={INVENTORY_FORM_TYPE.editSaved} auditor="auditorId" />);

    const promise = Promise.resolve();

    await act(() => promise);

    await expect(getByText(/Name/)).toBeTruthy();
  });
});
