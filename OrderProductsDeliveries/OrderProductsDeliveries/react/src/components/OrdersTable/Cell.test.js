import React from 'react';
import { render } from '@testing-library/react-native';
import { Cell } from './Cell';

test('Render Cell', () => {
    const { getByTestId } = render(<Cell content="title" style={{ background: '#000' }}/>);
    const cellText = getByTestId("cell-text");

    expect(cellText).toBeTruthy();
});

test('Render Cell empty style', () => {
    const { getByTestId } = render(<Cell content="title"/>);
    const cellText = getByTestId("cell-text");

    expect(cellText).toBeTruthy();
});