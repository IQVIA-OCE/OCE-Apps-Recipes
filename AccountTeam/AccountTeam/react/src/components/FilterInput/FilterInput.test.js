import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { FilterInput } from './FilterInput'

describe('FilterInput', () => {
    it("should render filter text input properly", async () => {
        const onChangeInputText = jest.fn()
        const { getByPlaceholderText } = render(<FilterInput onChangeInputText={onChangeInputText} placeholder={'User Name'} value={test} />)
        fireEvent.changeText(getByPlaceholderText('User Name'), 'test');
        expect(getByPlaceholderText(/User Name/i)).toBeTruthy();
        expect(onChangeInputText).toHaveBeenCalledTimes(1);
        expect(onChangeInputText).toHaveBeenCalledWith('test')
    })

})

