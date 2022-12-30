import React from 'react';
import DateField from './DateField';
import renderer, { act } from 'react-test-renderer';
import { DateTimePicker } from 'apollo-react-native';
import { useBoolean } from '../../../hooks';

jest.mock('../../../hooks');

describe('DateField', () => {
  beforeEach(() => {
    useBoolean.mockReturnValue([
      false,
      { toggle: jest.fn(), setFalse: jest.fn(), setTrue: jest.fn() },
    ]);
  });
  it('should render component', async () => {
    const promise = Promise.resolve();
    const onChange = jest.fn();
    let tree;

    act(() => {
      tree = renderer.create(<DateField onChange={onChange} />);
    })

    act( () => {
      tree.root.findByType(DateTimePicker).props.actions.done.onPress();
    })
    await act(() => promise);
    expect(onChange).toHaveBeenCalled();
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
