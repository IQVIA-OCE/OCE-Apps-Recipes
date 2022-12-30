import React from 'react';
import CustomAutoComplete from './CustomAutoComplete';
import renderer, { act } from 'react-test-renderer';
import { TouchableOpacity } from "react-native";
import { TextInput, Search } from 'apollo-react-native';

jest.useFakeTimers('legacy');

describe('CustomAutoComplete', () => {

    it('CustomAutoComplete should render properly', () => {
        const accounts = [{ label: '- / Akhtar', value: '0016s00000OYSujAAH' },
        { label: '- / Akhtar', value: '0016s00000OZjbvAAD' },
        { label: '- / BOWENtest', value: '0016g000006RAjJAAW' },
        { label: '- / BOWENtest', value: '0016g00000LAgpkAAD' },
        { label: '- / BOWENtest', value: '0016g00000LAgDtAAL' }]
        const tree = renderer.create(
            <CustomAutoComplete data={accounts} />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('CustomAutoComplete should select one record while user tap on flat list items', async () => {
        const accounts = [{ label: '- / Akhtar', value: '0016s00000OYSujAAH' },
        { label: '- / Akhtar', value: '0016s00000OZjbvAAD' },
        { label: '- / BOWENtest', value: '0016g000006RAjJAAW' },
        { label: '- / BOWENtest', value: '0016g00000LAgpkAAD' },
        { label: '- / BOWENtest', value: '0016g00000LAgDtAAL' }]
        const toggleListActive = jest.fn();
        const onSelectItem = jest.fn();
        const searchItemByQuery = jest.fn();
        const tree = renderer.create(
            <CustomAutoComplete data={accounts}
                searchItemByQuery={searchItemByQuery}
                isVisible={true}
                onSelectItem={onSelectItem}
                toggleListActive={toggleListActive} />
        );
        await act(async () => {
            tree.root.findAllByType(TouchableOpacity)[2].props.onPress({ label: '- / Akhtar', value: '0016s00000OZjbvAAD' });
            jest.advanceTimersByTime(500);
        });
        expect(tree).toMatchSnapshot();
    });
    it('CustomAutoComplete should fetch results for search query', async () => {
        const accounts = [{ label: '- / Akhtar', value: '0016s00000OYSujAAH' },
        { label: '- / Akhtar', value: '0016s00000OZjbvAAD' },
        { label: '- / BOWENtest', value: '0016g000006RAjJAAW' },
        { label: '- / BOWENtest', value: '0016g00000LAgpkAAD' },
        { label: '- / BOWENtest', value: '0016g00000LAgDtAAL' }]
        const toggleListActive = jest.fn();
        const searchItemByQuery = jest.fn();
        const tree = renderer.create(
            <CustomAutoComplete data={accounts} isVisible={true} searchItemByQuery={searchItemByQuery} toggleListActive={toggleListActive} />
        );
        await act(async () => {
            tree.root.findByType(TextInput).props.onFocus();
            tree.root.findByType(TextInput).props.onChangeText('Will');
            jest.advanceTimersByTime(500);
        });
        expect(tree).toMatchSnapshot();
    });
    it('CustomAutoComplete should clear the results when press on clearicon', async () => {
        const accounts = [{ label: '- / Akhtar', value: '0016s00000OYSujAAH' },
        { label: '- / Akhtar', value: '0016s00000OZjbvAAD' },
        { label: '- / BOWENtest', value: '0016g000006RAjJAAW' },
        { label: '- / BOWENtest', value: '0016g00000LAgpkAAD' },
        { label: '- / BOWENtest', value: '0016g00000LAgDtAAL' }]
        const toggleListActive = jest.fn();
        const searchItemByQuery = jest.fn();
        const onSelectItem = jest.fn();
        const tree = renderer.create(
            <CustomAutoComplete data={accounts}
                isVisible={true}
                onSelectItem={onSelectItem}
                searchItemByQuery={searchItemByQuery} toggleListActive={toggleListActive} />
        );
        await act(async () => {
            tree.root.findByType(Search).props.onIconPress();
            jest.advanceTimersByTime(500);
        });
        expect(tree).toMatchSnapshot();
    });

});
