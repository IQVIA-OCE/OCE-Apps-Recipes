import React from 'react';
import { Banner } from 'apollo-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { closeNotification } from '../../store/Notification/NotificationSlice';
import { notificationSelector } from '../../store/Notification/NotificationSelectors';

export const NotificationBanner = () => {
  const dispatch = useDispatch();
  const notification = useSelector(notificationSelector);

  const handleCloseNotification = () => {
    dispatch(closeNotification());
  };

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
