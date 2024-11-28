import React from 'react';
import SampleTransaction, {
} from './SampleTransaction';
import { AppContext } from '../../AppContext';
import { useBanner, useBoolean } from '../../hooks';
import { Button, Provider } from '@oce-apps/apollo-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  saveTransaction,
  fetchSampleProducts,
} from '../../api/SampleTransaction';
import { Formik } from 'formik';
import { render, act, fireEvent } from '@testing-library/react-native';
import moment from 'moment';

jest.mock('./initialFormValues', () => ({
  AcknowledgementOfShipment: {
    receivedDate: null,
    conditionOfPackage: '',
    comments: '',
    status: 'In Progress',
    transactionDateTime: '2020-05-25',
    transactionRepTerritory: {
      developerName: 'TMAur20A02T',
      name: 'TM - Aur',
      nameId: '1',
    },
    transactionRep: { Name: 'name', Id: undefined },
    user: { Name: 'name', Id: undefined },
  }
}));
jest.mock('@react-navigation/native');
jest.mock('../../hooks/useBanner');
jest.mock('../../hooks/useBoolean');

jest.mock('react-native-keyboard-aware-scroll-view', () => {
  const KeyboardAwareScrollView = ({ children }) => children;
  return { KeyboardAwareScrollView };
});

const mockedNavigate = jest.fn();

useNavigation.mockImplementation(() => ({
  navigate: mockedNavigate
}));

const setBanner = jest.fn();
useBanner.mockReturnValue([
  { variant: '', message: '', visible: false, icon: '' },
  setBanner,
]);
useBoolean.mockReturnValue([false, { setTrue: jest.fn() }]);

describe('SampleTransaction', () => {
  beforeEach(() => {
    setBanner.mockClear();
    mockedNavigate.mockClear();
    fetchSampleProducts.mockClear();
  });

  it('should render component in edit mode', () => {
    useRoute.mockReturnValue({
      params: {
        id: 'a5lF70000005q8OIAQ',
        recordType: {
          DeveloperName: 'AcknowledgementOfShipment',
          Name: 'Name'
        }
      }
    })

    const { UNSAFE_root } = render(
      <AppContext.Provider value={{ username: 'name' }}>
        <Provider>
          <SampleTransaction />
        </Provider>
      </AppContext.Provider>
    )
    act(() => jest.runAllTimers());
    expect(fetchSampleProducts).toHaveBeenCalled();

    fireEvent.press(UNSAFE_root.findAllByType(Button)[0]);
    act(() => jest.runAllTimers());

    expect(mockedNavigate).toHaveBeenCalledWith('Dashboard');
    act(() => jest.runAllTimers());
  });

  it('should render component in view mode', () => {
    useRoute.mockReturnValue({
      params: {
        id: 'a5lF70000005q8OIAQ',
        readonly: true,
        recordType: {
          DeveloperName: 'AcknowledgementOfShipment',
          Name: 'Name'
        }
      }
    });

    const { UNSAFE_root } = render(
      <AppContext.Provider value={{ username: 'name' }}>
        <Provider>
          <SampleTransaction />
        </Provider>
      </AppContext.Provider>
    );
    act(() => jest.runAllTimers());

    fireEvent.press(UNSAFE_root.findAllByType(Button)[0]);
    act(() => jest.runAllTimers());

    expect(mockedNavigate).toBeCalledWith('Dashboard');
    act(() => jest.runAllTimers());
  });

  it('should show error on save/submit', () => {
    useRoute.mockReturnValue({
      params: {
        id: 'a5lF70000005q8OIAQ',
        recordType: {
          DeveloperName: 'AcknowledgementOfShipment',
          Name: 'Name'
        }
      }
    });

    const { UNSAFE_root } = render(
      <AppContext.Provider value={{ username: 'name' }}>
        <Provider>
          <SampleTransaction />
        </Provider>
      </AppContext.Provider>
    )
    act(() => jest.runAllTimers());

    fireEvent.press(UNSAFE_root.findAllByType(Button)[1]);
    act(() => jest.runAllTimers());

    fireEvent(UNSAFE_root.findByType(Formik), 'onSubmit');
    act(() => jest.runAllTimers());

    expect(setBanner).toBeCalledWith({
      icon: 'alert-circle',
      message: expect.stringMatching(/Cannot read/),
      variant: 'error',
      visible: true,
    });
  });

  it('should delete transaction', () => {
    useRoute.mockReturnValue({
      params: {
        id: 'a5lF70000005q8OIAQ',
        readonly: true,
        recordType: {
          DeveloperName: 'AcknowledgementOfShipment',
          Name: 'Name'
        }
      }
    });

    const { UNSAFE_root } = render(
      <AppContext.Provider value={{ username: 'name' }}>
        <Provider>
          <SampleTransaction />
        </Provider>
      </AppContext.Provider>
    );
    act(() => jest.runAllTimers());

    fireEvent.press(UNSAFE_root.findAllByType(Button)[2]);
    act(() => jest.runAllTimers());

    expect(setBanner).toBeCalledWith({
      icon: 'checkbox-marked-circle',
      message: 'Successfully deleted.',
      variant: 'success',
      visible: true,
    });
    act(() => jest.runAllTimers());
  });

  it('should submit component', () => {
    useRoute.mockReturnValue({
      params: {
        id: 'a5lF70000005q8OIAQ',
        recordType: {
          DeveloperName: 'AcknowledgementOfShipment',
          Name: 'Name'
        }
      }
    });

    const { UNSAFE_root } = render(
      <AppContext.Provider value={{ username: 'name' }}>
        <Provider>
          <SampleTransaction />
        </Provider>
      </AppContext.Provider>
    );
    act(() => jest.runAllTimers());

    fireEvent.press(UNSAFE_root.findAllByType(Button)[1]);
    act(() => jest.runAllTimers());

    fireEvent(UNSAFE_root.findByType(Formik), 'onSubmit', {
      products: [{
        sampleProductId: 'sampleProductId',
        quantity: 2
      }],
      recordType: { DeveloperName: 'AcknowledgementOfShipment', Id: '1' },
      fields: {
        receivedDate: moment().format('YYYY-MM-DD'),
        status: 'In Progress',
        toSalesRep: { value: 'toSalesRep' },
        toSalesRepTerritory: 'toSalesRepTerritory',
        transactionRepTerritory: { name: 'Territory' },
        conditionOfPackage: { label: 'label' },
        transactionRep: { Id: '1' },
        user: {
          Id: '1',
        },
      },
    });
    act(() => jest.runAllTimers());

    expect(saveTransaction).toHaveBeenCalled()

    fireEvent.press(UNSAFE_root.findAllByType(Button)[2]);
    act(() => jest.runAllTimers());

    fireEvent(UNSAFE_root.findByType(Formik), 'onSubmit', {
      products: [{ sampleProductId: 'sampleProductId', quantity: 2 }],
      recordType: { DeveloperName: 'AcknowledgementOfShipment', Id: '1' },
      fields: {
        receivedDate: moment().format('YYYY-MM-DD'),
        status: 'In Progress',
        toSalesRep: { value: 'toSalesRep' },
        toSalesRepTerritory: 'toSalesRepTerritory',
        transactionRepTerritory: { name: 'Territory' },
        conditionOfPackage: { label: 'label' },
        transactionRep: { Id: '1' },
        user: {
          Id: '1',
        },
      },
    });
    act(() => jest.runAllTimers());

    expect(mockedNavigate).toHaveBeenCalledWith('Dashboard', {refreshSamplesTimelineWidget: true, refreshReceivedTimelineWidget: true});
    expect(saveTransaction).toHaveBeenCalled();
  });
});
