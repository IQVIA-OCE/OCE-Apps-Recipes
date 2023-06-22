import React from 'react';
import StorageLocation from './StorageLocation';
import { AppContext } from '../../AppContext';
import { useBanner, useFetcher, useHandleData } from '../../hooks';
import { Checkbox, Select, TextInput, Button, Loader } from 'apollo-react-native';
import { environment } from 'oce-apps-bridges';
import { Formik } from 'formik';
import { render, act } from '@testing-library/react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

jest.useFakeTimers();
jest.mock('../../hooks/index');
jest.mock('../../api/StorageLocation');
jest.mock('@react-navigation/native');

let navigation;
const context = {
  username: 'test user name',
  userId: '1',
};
let useBannerValue;

jest.mock('react-native-keyboard-aware-scroll-view', () => {
  const KeyboardAwareScrollView = ({ children }) => children;
  return { KeyboardAwareScrollView };
});

describe('StorageLocation', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });
  afterAll(() => {
    jest.useRealTimers();
  });
  beforeEach(() => {
    environment.userID = jest.fn().mockReturnValue('1');
    useBannerValue = [
      { variant: '', message: '', visible: false, icon: '' },
      jest.fn(),
    ];

    useNavigation.mockImplementation(() => ({
      getParam: () => {},
      goBack: () => {},
      setParams: () => {},
      navigate: jest.fn(),
    }))
    
    useRoute.mockReturnValue({
      params: {
        id: 'id'
      }
    });
    
    useFetcher.mockReturnValue([
      {
        loading: false,
        data: [
          {
            id: '1',
            label: 'country1',
          },
        ],
      },
    ]);
    useHandleData.mockImplementation(({ data }) => fn => fn(data));
    useBanner.mockReturnValue(useBannerValue);
  });

  it('Should render Create form', async () => {
    const { container } = render(
      <AppContext.Provider value={context}>
        <StorageLocation />
      </AppContext.Provider>
    );

    expect(container.findByType(Formik)).toBeTruthy();
  });

  it('Should trigger form value change', async () => {
    const { container } = render(
      <AppContext.Provider value={context}>
        <StorageLocation />
      </AppContext.Provider>
    );
    
    act(() => {
      container.findAllByType(TextInput)[0].props.onChangeText('address 1');
      container.findAllByType(TextInput)[1].props.onChangeText('address 2');
      container.findAllByType(TextInput)[2].props.onChangeText('city');
      container.findAllByType(TextInput)[3].props.onChangeText('zip');
      container.findAllByType(Select)[0].props.onChange('');
      container.findAllByType(Select)[1].props.onChange('');
      container.findByType(Checkbox).props.onPress();
    });

    expect(container.findAllByType(TextInput)[0].props.value).toBe('address 1');
    expect(container.findAllByType(TextInput)[1].props.value).toBe('address 2');
    expect(container.findAllByType(TextInput)[2].props.value).toBe('city');
    expect(container.findAllByType(TextInput)[3].props.value).toBe('zip');
  });

  it('Should trigger button clicks', async () => {
    const { container } = render(
      <AppContext.Provider value={context}>
        <StorageLocation />
      </AppContext.Provider>
    )

    act(() => {
      container.findAllByType(Button)[0].props.onPress();
    });

    expect(container.findByType(Formik)).toBeTruthy();
  });

  it('Should trigger submit', async () => {
    const { container } = render(
      <AppContext.Provider value={context}>
        <StorageLocation />
      </AppContext.Provider>
    );

    await act(
      async () =>
        await container
          .findByType(Formik)
          .props.onSubmit(
            { address1: '' },
            { resetForm: () => {}, setValues: () => {} }
          )
    );
    expect(useBannerValue[1]).toHaveBeenCalledTimes(1);
  });
});

describe('StorageLocation', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });
  afterAll(() => {
    jest.useRealTimers();
  });
  beforeEach(() => {
    useNavigation.mockImplementation(() => ({
      getParam: () => {},
      goBack: () => {},
      setParams: () => {},
      navigate: jest.fn(),
    }))

    useRoute.mockReturnValue({
      params: {
        locationId: 'id'
      }
    });
    useBannerValue = [
      { variant: '', message: '', visible: false, icon: '' },
      jest.fn(),
    ];
    useFetcher
      .mockReturnValueOnce([
        {
          loading: false,
          data: [
            {
              id: '1',
              label: 'country1',
              states: [
                {
                  id: '11',
                  label: 'state 11',
                },
              ],
            },
          ],
        },
      ])
      .mockReturnValueOnce([
        {
          loading: false,
          data: [
            {
              address1: 'address1',
              address2: 'address2',
              city: 'city',
              country: '1',
              state: '11',
              zip: '1',
              default: true,
              createdById: '1',
              modifiedById: '1',
              createdDate: 'created date',
              modifiedDate: 'modified date',
            },
          ],
        },
      ])
      .mockReturnValueOnce([
        {
          loading: false,
          data: {
            '2': 'Second user',
          },
        },
      ])
      .mockReturnValueOnce([
        {
          loading: true,
          data: [],
        },
      ])
      .mockReturnValueOnce([
        {
          loading: true,
          data: {
            '2': 'Second user',
          },
        },
      ]);
    useHandleData.mockImplementation(({ data }) => fn => fn(data));
    useBanner.mockReturnValue(useBannerValue);
  });

  it('Should render Edit form', async () => {
    const { getByText } = render(
      <AppContext.Provider value={context}>
        <StorageLocation />
      </AppContext.Provider>
    );

    expect(getByText(/Edit/)).toBeTruthy();
  });

  it('Should show loader', async () => {
    const { container } = render(
      <AppContext.Provider value={context}>
        <StorageLocation />
      </AppContext.Provider>
    );

    expect(container.findAllByType(Loader)).toBeTruthy();
  });

  it('Should trigger submit and redirect', async () => {
    const { container } = render(
      <AppContext.Provider value={context}>
        <StorageLocation />
      </AppContext.Provider>
    );

    await act(
      async () =>
        await container
          .findByType(Formik)
          .props.onSubmit(
            { address1: '' },
            { resetForm: () => {}, setValues: () => {} }
          )
    );
    expect(useBannerValue[1]).toHaveBeenCalledTimes(1);
  });
});
