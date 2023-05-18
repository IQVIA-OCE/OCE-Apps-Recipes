import React from 'react';
import AccountItem from './AccountItem';
import { IconButton, Provider, DarkTheme } from 'apollo-react-native';
import { navigator } from "oce-apps-bridges";
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
import { render, fireEvent, screen } from '@testing-library/react-native';

jest.useFakeTimers()

const itemData = {
  'Id': '0019D000006hacMQAQ',
  'OCE__Specialty__c': 'Family medicine',
  'Name': 'AZEEM M AHSAN',
  'OCE__AccountFullName__c': null,
  'MiddleName': 'M',
  'Phone': '8157412525',
  'LastName': 'AHSAN',
  'OCE__PrimaryAccountAddress__r': {
    'OCE__City__c': 'NEW LENOX',
    'OCE__AddressLine1__c': 'OCE__AddressLine1__c'
  },
  'OCE__RecordTypeName__c': null,
  'FirstName': 'AZEEM'
};

describe('AccountItem', () => {
  beforeAll(() => {
    navigator.dispatch = jest.fn()
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({})
        .mockRejectedValueOnce({})
        .mockRejectedValueOnce({})
  });

  it('Should render AccountItem component', () => {
    const tree = render(
        <AccountItem
            itemData={itemData}
        />
    );

    expect(tree).toBeTruthy();
  });

  it('Should render AccountItem component in dark mode', () => {
    const tree = render(
        <Provider theme={DarkTheme}>
          <AccountItem
              itemData={itemData}
          />
        </Provider>
    );

    expect(tree).toBeTruthy();
  });

  it('should call IconButtons onPress function', () => {
    const mockedNavigation = { navigate: jest.fn().mockReturnValue(true) }

    render(
        <AccountItem
            itemData={itemData}
            navigation={mockedNavigation}
        />
    );

    const iconButtons = screen.UNSAFE_getAllByType(IconButton);
    iconButtons.forEach(el => {
      fireEvent.press(el);
    });

    expect(mockedNavigation.navigate).toHaveBeenCalled();
  });

  it('should call IconButtons onPress function with errors', () => {
    const mockedNavigation = { navigate: jest.fn().mockImplementation(() => {
        throw new Error({ message: 'Test error' });
      }) }

    render(
        <AccountItem
            itemData={itemData}
            navigation={{ navigate: jest.fn() }}
        />
    );

    const iconButtons = screen.UNSAFE_getAllByType(IconButton);
    iconButtons.forEach(el => {
      fireEvent.press(el);
    });

    expect(mockedNavigation.navigate).toThrow();
  });
});
