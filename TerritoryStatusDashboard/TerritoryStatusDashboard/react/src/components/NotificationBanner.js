import { Banner } from '@oce-apps/apollo-react-native';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { notificationSelector } from '../store/notification/notificationSelectors';
import { closeNotification } from '../store/notification/notificationSlice';

export const NotificationBanner = () => {
  const notification = useSelector(notificationSelector);
  const dispatch = useDispatch();

  const handleCloseBanner = () => {
    dispatch(closeNotification());
  };

  return (
    <Banner
      closeIcon
      visible={notification.isVisible}
      variant={notification.variant}
      icon={notification.icon}
      onCloseIconPress={handleCloseBanner}
    >
      {notification.text}
    </Banner>
  );
};
