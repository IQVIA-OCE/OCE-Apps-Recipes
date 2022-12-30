import React from 'react';
import DonutChartContainer from './DonutChartContainer';
import renderer, { act } from 'react-test-renderer';
import { TouchableOpacity } from "react-native";
import { Menu } from 'apollo-react-native';

jest.useFakeTimers('legacy');

describe('DonutChartContainer', () => {

    it('DonutChartContainer should render properly without data', () => {
        const tree = renderer.create(
            <DonutChartContainer />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('DonutChartContainer should render properly with data', async () => {
        const selectedProduct = {
            label: 'Product A1',
            value: {
                disbursed: 7,
                hqLimit: 4,
                managerLimit: 4,
                quota: 10,
                remaining: 3,
                repLimit: 10,

            }
        }
        const tree = renderer.create(
            <DonutChartContainer selectedProduct={selectedProduct} />
        );
        await act(async () => {
            const menuComponent = tree.root.findByType(Menu);
            menuComponent.props.onDismiss();
            const menuBtn = tree.root.findByType(TouchableOpacity);
            menuBtn.props.onPress();
            jest.advanceTimersByTime(500);
        });
        expect(tree).toMatchSnapshot();
    });

});
