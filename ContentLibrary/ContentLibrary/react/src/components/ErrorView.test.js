import React from 'react';
import { render } from '@testing-library/react-native';
import ErrorView from './ErrorView';

test('Render ErrorView', () => {
    const { getByTestId } = render(<ErrorView />);
    const errorView = getByTestId("error-view");
    expect(errorView).toBeTruthy();
});