import { useSelector } from 'react-redux';
import {
  todosListItemsSelector,
  todosListParamsSelector,
  todosListTotalCountSelector,
} from '../../../store/callToDos/callToDosSelectors';

export const useCallToDosList = () => {
  const params = useSelector(todosListParamsSelector);
  const callToDos = useSelector(todosListItemsSelector);
  const totalCount = useSelector(todosListTotalCountSelector);

  return {
    params,
    callToDos,
    totalCount,
  };
};
