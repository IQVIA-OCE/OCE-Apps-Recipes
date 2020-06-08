import React from 'react';
import DateField from './DateField';
import renderer from 'react-test-renderer';
import { DateTimePicker } from 'apollo-react-native';

describe('DateField', () => {
  it('should render component', () => {
    const onChange = jest.fn();
    const tree = renderer.create(<DateField onChange={onChange} />);

    expect(tree.toJSON()).toMatchSnapshot();

    tree.root.findByType(DateTimePicker).props.actions.done.onPress();
    expect(onChange).toHaveBeenCalled();
  });
});
