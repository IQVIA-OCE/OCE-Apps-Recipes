import React from 'react';
import { Banner } from 'apollo-react-native';
import { notificationSelector } from '../store/notification/notificationSelectors';
import { closeNotification } from '../store/notification/notificationSlice';
import { useDispatch, useSelector } from 'react-redux';

export const ErrorBanner = () => {
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
