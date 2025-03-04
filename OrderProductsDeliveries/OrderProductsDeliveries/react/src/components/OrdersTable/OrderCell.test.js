import React from 'react';
import { render } from '@testing-library/react-native';
import { OrderCell } from "./OrderCell";

test('Render OrderCell', () => {
    const { getByTestId } = render(<OrderCell productName={"productName"} productCode={"productCode"}/>);
    const productName = getByTestId("product-name");
    const productCode = getByTestId("product-code");

    expect(productName).toBeTruthy();
    expect(productCode).toBeTruthy();
});