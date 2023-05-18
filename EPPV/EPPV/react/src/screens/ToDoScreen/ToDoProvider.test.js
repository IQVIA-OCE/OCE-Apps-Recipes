import { act, fireEvent, render } from '@testing-library/react-native';
import { Button, Text } from 'apollo-react-native';
import { ToDoListContext, ToDoListProvider } from './ToDoProvider';
import React, { useContext } from 'react';
import { View } from 'react-native';

const TestingComponent = () => {
  const { openedItemKey, setOpenedItemKey } = useContext(ToDoListContext);
  return (
    <View>
      <Button testID="setNewKey" onPress={() => setOpenedItemKey('NEW')}>
        SetKey
      </Button>
      <Text>{openedItemKey}</Text>
    </View>
  );
};

describe('<ToDoListProvider />', () => {
  it('should render properly', async () => {
    const promise = Promise.resolve();
    const { getByTestId, getByText } = render(
      <ToDoListProvider>
        <TestingComponent />
      </ToDoListProvider>
    );
    await act(() => promise);

    const setNewKey = await getByTestId('setNewKey');

    await act(async () => {
      fireEvent.press(setNewKey);
    });

    expect(getByText('NEW')).toBeTruthy();
  });
});
