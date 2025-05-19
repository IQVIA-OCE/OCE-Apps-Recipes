import React from 'react';
import { Banner } from '@oce-apps/apollo-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { notificationSelector } from '../../store/notification/notificationSelectors';
import { closeNotification } from '../../store/notification/notificationSlice';

export const NotificationContainer = () => {
  const notification = useSelector(notificationSelector);
  const dispatch = useDispatch();

  const handleCloseNotification = () => dispatch(closeNotification());

  return (
    <Banner
      closeIcon
      visible={notification.isVisible}
      variant={notification.variant}
      icon={notification.icon}
      onCloseIconPress={handleCloseNotification}
    >
      {notification.text}
    </Banner>
  );
};
