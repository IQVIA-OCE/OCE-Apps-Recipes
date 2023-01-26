import React from 'react';
import SampleOrder from './SampleOrder';
import { AppContext } from '../../../AppContext';
import { useFetcher, useBanner, useHandleData } from '../../hooks';
import { Button } from 'apollo-react-native';
import { Formik } from 'formik';
import { saveSampleOrder } from '../../api/SampleOrder';
import { getSampleOrderConfigById } from './utils';
import { environment } from 'oce-apps-bridges';
import { render, act } from '@testing-library/react-native';
import FormPanel from './FormPanel/FormPanel';

jest.mock('../../hooks');
jest.mock('./utils');
jest.mock('../../api/SampleOrder');
jest.mock('react-native-keyboard-aware-scroll-view', () => {
  const KeyboardAwareScrollView = ({ children }) => children;
  return { KeyboardAwareScrollView };
});

const navigation = {
  getParam: jest.fn(),
  navigate: jest.fn(),
};

const setBanner = jest.fn();
const useBannerValue = [
  { variant: '', message: '', visible: false, icon: '' },
  setBanner,
];

describe('SampleOrder', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });
  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    environment.userID = jest.fn().mockReturnValue('1');
    getSampleOrderConfigById.mockReturnValue({
      lockedStatus: '',
      finalStatus: 'Approved',
      orderCheck: false,
      isApprovalRequired: false,
      enableProductAllocation: false,
      showProductAllocationRemaining: false,
    });
    useFetcher
      .mockReturnValueOnce([
        {
          data: [
            {
              ProfileId: '00e1e000000HpZhAAK',
              Id: '0056F00000B45ezQAB',
            },
          ],
          loading: false,
        },
        { handleFetch: jest.fn() },
      ])
      .mockReturnValueOnce([
        {
          data: null,
          loading: false,
        },
        { handleFetch: jest.fn() },
      ])
      .mockReturnValueOnce([
        {
          data: [
            {
              OCE__MaxOrder__c: 5,
              Name: 'ADRAVIL TAB 10 MG Physical',
              OCE__MinOrder__c: 1,
              OCE__ParentProduct__r: {
                Name: 'ADRAVIL-DETAIL',
              },
              OCE__SKU__c: null,
              OCE__IsAvailableForAllocation__c: true,
              Id: 'a4x1e0000002kfOAAQ',
            },
          ],
          loading: false,
        },
        { handleFetch: jest.fn() },
      ])
      .mockReturnValueOnce([
        {
          data: { status: 'In Progress', name: 'Test name' },
          loading: false,
        },
        { handleFetch: jest.fn() },
      ])
      .mockReturnValueOnce([
        {
          data: null,
          loading: false,
        },
        { handleFetch: jest.fn() },
      ])
      .mockReturnValue([
        {
          data: [],
          loading: false,
        },
        { handleFetch: jest.fn() },
      ]);
    useBanner.mockReturnValue(useBannerValue);
    useHandleData.mockImplementation(({ data }) => fn => fn(data));
    saveSampleOrder.mockResolvedValue([{ id: '1' }]);
  });

  it('should render component', () => {
    const { container } = render(
      <AppContext.Provider value={{ username: 'name' }}>
        <SampleOrder
          navigation={{
            ...navigation,
            getParam: jest.fn().mockImplementation((value, defaultValue) => {
              if (value == 'readonly') return false;
              if (value == 'id') return null;

              return defaultValue;
            }),
          }}
        />
      </AppContext.Provider>
    );

    act(() => container.findAllByType(Button)[0].props.onPress());
    expect(navigation.navigate).toBeCalledWith('Dashboard');
  });

  it('should render component in view mode', () => {
    const { container } = render(
      <AppContext.Provider value={{ username: 'name' }}>
        <SampleOrder
          navigation={{
            ...navigation,
            getParam: jest.fn().mockImplementation((value, defaultValue) => {
              if (value == 'readonly') return true;
              if (value == 'id') return 'id';

              return defaultValue;
            }),
          }}
        />
      </AppContext.Provider>
    );

    expect(container.findByType(FormPanel).props.readonly).toBeTruthy();
  });

  it('should render component in edit mode', () => {
    const { getByText } = render(
      <AppContext.Provider value={{ username: 'name' }}>
        <SampleOrder
          navigation={{
            ...navigation,
            getParam: jest.fn().mockImplementation((value, defaultValue) => {
              if (value == 'readonly') return false;
              if (value == 'id') return 'id';

              return defaultValue;
            }),
          }}
        />
      </AppContext.Provider>
    );

    expect(getByText('Test name')).toBeTruthy();
  });

  it('should show error on save/submit', async () => {
    const { container } = render(
      <AppContext.Provider value={{ username: 'name' }}>
        <SampleOrder
          navigation={{
            ...navigation,
            getParam: jest.fn().mockImplementation((value, defaultValue) => {
              if (value == 'readonly') return false;
              if (value == 'id') return '';

              return defaultValue;
            }),
          }}
        />
      </AppContext.Provider>
    );


    act(() => container.findAllByType(Button)[2].props.onPress());
    await act(async () => await container.findByType(Formik).props.onSubmit())

    expect(setBanner).toBeCalledWith({
      icon: 'alert-circle',
      message: expect.stringMatching(/Cannot read/),
      variant: 'error',
      visible: true,
    });
  });

  it('should save/submit component', async () => {
    const { container } = render(
      <AppContext.Provider value={{ username: 'name' }}>
        <SampleOrder
          navigation={{
            ...navigation,
            getParam: jest.fn().mockImplementation((value, defaultValue) => {
              if (value == 'readonly') return false;
              if (value == 'id') return '';

              return defaultValue;
            }),
          }}
        />
      </AppContext.Provider>
    );

    act(() => container.findAllByType(Button)[1].props.onPress());

    await act(
      async () =>
        await container.findByType(Formik).props.onSubmit({
          fields: {
            isUrgent: false,
            comments: '',
            status: 'In Progress',
            territory: 'Territory',
            shipTo: { id: 'id', lable: 'label' },
            user: { id: 'id' },
            transactionRep: { id: 'id' },
          },
          products: [
            { id: 'id', quantity: 3, OCE__MaxOrder__c: 5, OCE__MinOrder__c: 0 },
          ],
          orderCheck: true,
        })
    );
    jest.advanceTimersByTime(3000);
    expect(navigation.navigate).toBeCalledWith('Dashboard');

    act(() => container.findAllByType(Button)[2].props.onPress());
    await act(
      async () =>
        await container.findByType(Formik).props.onSubmit({
          fields: {
            isUrgent: false,
            comments: '',
            status: 'In Progress',
            territory: 'Territory',
            shipTo: { id: 'id', lable: 'label' },
            user: { id: 'id' },
            transactionRep: { id: 'id' },
          },
          products: [{ quantity: 1, comments: 'comment' }],
          orderCheck: true,
        })
    );

    expect(saveSampleOrder).toHaveBeenCalled();
  });

  it('should save/submit component with enabled product allocation', async () => {
    getSampleOrderConfigById.mockReturnValueOnce({
      lockedStatus: '',
      finalStatus: 'Approved',
      orderCheck: true,
      isApprovalRequired: false,
      enableProductAllocation: true,
      showProductAllocationRemaining: true,
    });

    const { container } = render(
      <AppContext.Provider value={{ username: 'name' }}>
        <SampleOrder
          navigation={{
            ...navigation,
            getParam: jest.fn().mockImplementation((value, defaultValue) => {
              if (value == 'readonly') return false;
              if (value == 'id') return '';

              return defaultValue;
            }),
          }}
        />
      </AppContext.Provider>
    )

    act(() => container.findAllByType(Button)[1].props.onPress());

    await act(
      async () =>
        await container.findByType(Formik).props.onSubmit({
          fields: {
            isUrgent: false,
            comments: '',
            status: 'In Progress',
            territory: 'Territory',
            shipTo: { id: 'id', lable: 'label' },
            user: { id: 'id' },
            transactionRep: { id: 'id' },
          },
          products: [
            { id: 'id', quantity: 3, OCE__MaxOrder__c: 5, OCE__MinOrder__c: 0 },
          ],
          orderCheck: true,
        })
    );
    jest.advanceTimersByTime(3000);
    expect(navigation.navigate).toBeCalledWith('Dashboard');


    act(() => container.findAllByType(Button)[2].props.onPress());
    await act(
      async () =>
        await container.findByType(Formik).props.onSubmit({
          fields: {
            isUrgent: false,
            comments: '',
            status: 'In Progress',
            territory: 'Territory',
            shipTo: { id: 'id', lable: 'label' },
            user: { id: 'id' },
            transactionRep: { id: 'id' },
          },
          products: [{ quantity: 1, comments: 'comment' }],
          orderCheck: true,
        })
    );

    expect(saveSampleOrder).toHaveBeenCalled();
  });

  it('should delete sample order', async () => {
    const { container } = render(
      <AppContext.Provider value={{ username: 'name' }}>
        <SampleOrder
          navigation={{
            ...navigation,
            getParam: jest.fn().mockImplementation((value, defaultValue) => {
              if (value == 'readonly') return true;
              if (value == 'id') return 'id';

              return defaultValue;
            }),
          }}
        />
      </AppContext.Provider>
    )

    await act(() => container.findAllByType(Button)[3].props.onPress());

    expect(setBanner).toBeCalledWith({
      icon: 'checkbox-marked-circle',
      message: 'Successfully deleted.',
      variant: 'success',
      visible: true,
    });
  });
});
