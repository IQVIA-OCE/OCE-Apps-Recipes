import React, { useEffect } from 'react';
import { ScrollView, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Card from '../../Card/Card';
import { attendeesListSelector } from '../../../store/attendeesSlice/attendeesSelectors';
import { fetchOutstandingSampleRequestsList } from '../../../store/outstandingSampleRequestsSlice/outstandingSampleRequestsSlice';
import {
  outstandingSampleRequestsCountSelector,
  outstandingSampleRequestsSelector,
} from '../../../store/outstandingSampleRequestsSlice/outstandingSampleRequestsSelectors';
import OutstandingSampleRequestListItem from './components/components/OutstandingSampleRequestListItem';
import { isIphone } from '../../../utils/helpers';

const OutstandingSampleRequestsWidget = ({ testID = "OutstandingSR_widget" }) => {
  const attendeesList = useSelector(attendeesListSelector);
  const outstandingSampleRequestsCount = useSelector(outstandingSampleRequestsCountSelector);
  const outstandingSampleRequestsList = useSelector(outstandingSampleRequestsSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    if (attendeesList) {
      dispatch(fetchOutstandingSampleRequestsList());
    }
  }, [attendeesList]);

  return (
    <Card
      icon="pill"
      title="Outstanding sample requests"
      count={outstandingSampleRequestsCount}
      testID={testID}
      style={{ height: isIphone ? 'auto' : 345 }}
    >
      <ScrollView style={{ height: 300, paddingTop: 15 }}>
        {outstandingSampleRequestsCount > 0 ? (
          outstandingSampleRequestsList.map((item) => (
            <OutstandingSampleRequestListItem name={item.Name} samples={item.samples} key={item.Id} callId={item.callId}/>
          ))
        ) : (
          <Text>There are no outstanding sample requests from your meeting participants</Text>
        )}
      </ScrollView>
    </Card>
  );
};

export default OutstandingSampleRequestsWidget;
