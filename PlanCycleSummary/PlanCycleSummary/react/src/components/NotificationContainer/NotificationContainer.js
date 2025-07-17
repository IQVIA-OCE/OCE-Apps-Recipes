import React from 'react';
import { Banner } from '@oce-apps/apollo-react-native';
import { useSelector } from 'react-redux';
import { errorNotificationsSelector } from '../../utils/selectors';

const NotificationContainer = () => {
  const errors = useSelector(errorNotificationsSelector);

  return (
    <>
      {errors.map(error => (
        <Banner
          key={error}
          visible={!!error}
          variant={'error'}
          icon={'alert-circle'}
        >
          {error}
        </Banner>
      ))}
    </>
  )
}

export default NotificationContainer;
