import React from 'react';
import renderer, { act, cleanup } from 'react-test-renderer';
import StorageLocation from './StorageLocation';
import { AppContext } from '../../../AppContext';
import { useBanner, useFetcher, useHandleData } from '../../hooks';
import { Checkbox, Select, TextInput, Button } from 'apollo-react-native';
import { environment } from '../../../bridge/EnvironmentData/EnvironmentData.native';
import { Formik } from 'formik';
import {
  saveLocations,
  fetchCountries,
  fetchLocationById,
  deleteLocation,
} from '../../api/StorageLocation';

jest.mock('../../hooks/index');
jest.mock('../../../bridge/EnvironmentData/EnvironmentData.native');
jest.mock('../../api/StorageLocation');

let navigation;
const context = {
  username: 'test user name',
  userId: '1',
};
let useBannerValue;

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
    navigation = {
      getParam: () => {},
      goBack: () => {},
      setParams: () => {},
      navigate: jest.fn(),
    };
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
    let tree;
    act(() => {
      tree = renderer.create(
        <AppContext.Provider value={context}>
          <StorageLocation navigation={navigation} />
        </AppContext.Provider>
      );
    });

    expect(tree.toJSON()).toMatchSnapshot();
    act(() => {
      tree.update();
    });
  });

  it('Should trigger form value change', async () => {
    let tree;
    act(() => {
      tree = renderer.create(
        <AppContext.Provider value={context}>
          <StorageLocation navigation={navigation} />
        </AppContext.Provider>
      );
    });
    act(() => {
      tree.root.findAllByType(TextInput)[0].props.onChangeText('address 1');
      tree.root.findAllByType(TextInput)[1].props.onChangeText('address 2');
      tree.root.findAllByType(TextInput)[2].props.onChangeText('city');
      tree.root.findAllByType(TextInput)[3].props.onChangeText('zip');
      tree.root.findAllByType(Select)[0].props.onChange('');
      tree.root.findAllByType(Select)[1].props.onChange('');
      tree.root.findByType(Checkbox).props.onPress();
    });
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('Should trigger button clicks', async () => {
    let tree;
    act(() => {
      tree = renderer.create(
        <AppContext.Provider value={context}>
          <StorageLocation navigation={navigation} />
        </AppContext.Provider>
      );
    });
    act(() => {
      tree.root.findAllByType(Button)[0].props.onPress();
      // tree.root.findAllByType(Button)[1].props.onPress();
      // tree.root.findAllByType(Button)[2].props.onPress();
    });
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('Should trigger submit', async () => {
    let tree;
    act(() => {
      tree = renderer.create(
        <AppContext.Provider value={context}>
          <StorageLocation navigation={navigation} />
        </AppContext.Provider>
      );
    });
    await act(
      async () =>
        await tree.root
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
  beforeEach(() => {
    navigation = {
      getParam: () => 1,
      goBack: () => {},
      setParams: () => {},
      navigate: () => {},
    };
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
    let tree;
    act(() => {
      tree = renderer.create(
        <AppContext.Provider value={context}>
          <StorageLocation navigation={navigation} />
        </AppContext.Provider>
      );
    });

    expect(tree.toJSON()).toMatchSnapshot();
    act(() => {
      tree.update();
    });
  });

  it('Should show loader', async () => {
    let tree;
    act(() => {
      tree = renderer.create(
        <AppContext.Provider value={context}>
          <StorageLocation navigation={navigation} />
        </AppContext.Provider>
      );
    });
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('Should trigger submit and redirect', async () => {
    let tree;
    act(() => {
      tree = renderer.create(
        <AppContext.Provider value={context}>
          <StorageLocation navigation={navigation} />
        </AppContext.Provider>
      );
    });
    await act(
      async () =>
        await tree.root
          .findByType(Formik)
          .props.onSubmit(
            { address1: '' },
            { resetForm: () => {}, setValues: () => {} }
          )
    );
    expect(useBannerValue[1]).toHaveBeenCalledTimes(1);
  });
});
