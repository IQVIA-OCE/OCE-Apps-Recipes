import React from 'react'
import { render } from '@testing-library/react-native'
import { Seperator } from './Seperator'

describe('Seperator', () => {
    it("should render Seperator  properly", async () => {
        const { getByTestId } = render(<Seperator />)
        expect(getByTestId('flatListSeperator')).toBeTruthy();
    })
})

