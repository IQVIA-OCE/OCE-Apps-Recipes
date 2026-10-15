import React from 'react';
import { render } from '@testing-library/react-native';
import NoConnectionView from './NoConnectionView';

test('Render NoConnectionView', () => {
    const { getByTestId } = render(<NoConnectionView />);
    const noConnectionView = getByTestId("no-connection-view");
    expect(noConnectionView).toBeTruthy();
});