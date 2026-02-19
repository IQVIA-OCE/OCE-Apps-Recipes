import { render, act } from '@testing-library/react-native';
import { AccountItem } from './AccountItem';
import { RadioButton } from '@oce-apps/apollo-react-native';

const ACCOUNT = {
  id: '1',
  name: 'Test name',
  kanaName: 'Test kana name',
};

describe('AccountItem', () => {
  it('should render properly', () => {
    const onPress = jest.fn();
    const { getByText, UNSAFE_getByType } = render(<AccountItem item={ACCOUNT} cellWidth={100} onPress={onPress} />);

    expect(getByText('Test name')).toBeTruthy();
    expect(getByText('Test kana name')).toBeTruthy();

    const radioButtonEl = UNSAFE_getByType(RadioButton);

    act(() => {
      radioButtonEl.props.onChange();
    });

    expect(onPress).toHaveBeenCalledTimes(1);
    expect(onPress).toHaveBeenCalledWith(ACCOUNT);
  });

  it('should render properly with checked state', () => {
    const onPress = jest.fn();
    const { UNSAFE_getByType } = render(
      <AccountItem
        item={ACCOUNT}
        selectedAccount={{ label: 'Test name', value: '1' }}
        cellWidth={100}
        onPress={onPress}
      />
    );
    const radioButtonEl = UNSAFE_getByType(RadioButton);

    expect(radioButtonEl.props.status).toBe('checked');
  });
});
