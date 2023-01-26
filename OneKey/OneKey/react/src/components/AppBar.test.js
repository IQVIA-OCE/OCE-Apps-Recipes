import { Appbar as ApolloAppBar } from 'apollo-react-native';
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import AppBar from './AppBar';

describe('AppBar', () => {
    it('Should render AppBar component', () => {
        render(
            <AppBar
                navigation={{
                    isFirstRouteInParent: () => { }
                }}
                navigationOptions={{ title: '' }}
                testID={'AppBarComponent'}
            />
        );

        expect(screen.getByTestId('AppBarComponent')).toBeTruthy();
    });

    it('Should render AppBar component with isFirstRouteInParent', () => {
        render(
            <AppBar
                navigation={{
                    isFirstRouteInParent: () => true
                }}
                navigationOptions={{ title: '' }}
                testID={'AppBarComponent'}
            />
        );

        expect(screen.getByTestId('AppBarComponent')).toBeTruthy();
    });

    it('Should render AppBar component with goBack action', () => {
        const mockedCanGoBack = jest.fn().mockReturnValue(true);

        render(
            <AppBar
                navigation={{
                    isFirstRouteInParent: () => {},
                    goBack: mockedCanGoBack
                }}
                navigationOptions={{ title: '' }}
            />
        );

        fireEvent.press(screen.UNSAFE_getByType(ApolloAppBar.Action));

        expect(mockedCanGoBack).toHaveBeenCalled();
    });

    it('Should render AppBar component with openVRform action', () => {
        const navigate = jest.fn();

        render(
            <AppBar
                navigation={{
                    isFirstRouteInParent: () => true,
                    navigate: navigate,
                }}
                navigationOptions={{ title: 'Accounts' }}
            />
        );

        fireEvent.press(screen.UNSAFE_getByType(ApolloAppBar.Action));

        expect(navigate).toHaveBeenCalledWith('OneKeyValidationRequest');
    });
});