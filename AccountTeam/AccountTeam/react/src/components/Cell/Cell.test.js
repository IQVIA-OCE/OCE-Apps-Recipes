import React from 'react'
import { render } from '@testing-library/react-native'
import { Cell } from './Cell'

describe('Cell', () => {
    it("should render Cell  properly", async () => {
        const propValue = {
            accessor: 'Name',
            value: 'Partner Admin',
            testID: 'cellContainer'
        }
        const { getByTestId } = render(<Cell {...propValue} />)
        expect(getByTestId('cellContainer')).toBeTruthy();
        expect(getByTestId('cellContainer').props.children[0].props.children).toEqual('Name');
        expect(getByTestId('cellContainer').props.children[1].props.children).toEqual('Partner Admin');
    })
    it("should render Cell without value property", async () => {
        const propValue = {
            accessor: 'Name',
            testID: 'cellContainer'
        }
        const { getByTestId } = render(<Cell {...propValue} />)
        expect(getByTestId('cellContainer')).toBeTruthy();
        expect(getByTestId('cellContainer').props.children[0].props.children).toEqual('Name');
        expect(getByTestId('cellContainer').props.children[1].props.children).toEqual('--');
    })
})

