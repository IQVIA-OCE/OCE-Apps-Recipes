import { render, act } from '@testing-library/react-native';
import { AccountsList } from './AccountsList';
import { ACCOUNTS_MAPPED } from '../../__mocks__/accountMocks';

describe('AccountsList', () => {
  it('should render properly', () => {
    const { getByTestId, getAllByTestId } = render(
      <AccountsList data={ACCOUNTS_MAPPED} cellWidth={100} isLoading={false} />
    );

    expect(getByTestId('callTodoList')).toBeTruthy();
    expect(getAllByTestId('itemSeparator').length).toBe(4);
  });

  it('should render properly with empty state', () => {
    const { getByTestId, queryByText, update } = render(<AccountsList data={[]} cellWidth={100} isLoading={true} />);

    expect(getByTestId('listEmptyComponent')).toBeTruthy();
    expect(queryByText('No Records Found')).toBeNull();

    update(<AccountsList data={[]} cellWidth={100} isLoading={false} />);

    expect(getByTestId('listEmptyComponent')).toBeTruthy();
    expect(queryByText('No Records Found')).toBeTruthy();
  });

  it('should handle onEndReached event', () => {
    const loadMore = jest.fn();
    const { getByTestId } = render(
      <AccountsList data={ACCOUNTS_MAPPED} cellWidth={100} loadMore={loadMore} isLoading={false} />
    );

    const list = getByTestId('callTodoList');

    act(() => {
      list.props.onEndReached({ distanceFromEnd: -1 });
    });

    expect(loadMore).toHaveBeenCalledTimes(0);

    act(() => {
      list.props.onEndReached({ distanceFromEnd: 1 });
    });

    expect(loadMore).toHaveBeenCalledTimes(1);
  });
});
