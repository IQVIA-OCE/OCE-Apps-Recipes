import { Banner } from '@oce-apps/apollo-react-native';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { notificationsSelector } from '../store/notification/notificationSelector';
import { closeNotification } from '../store/notification/notificationSlice';

export const NotificationBanner = () => {
  const notifications = useSelector(notificationsSelector);
  const dispatch = useDispatch();

  const handleCloseBanner = (index) => {
    dispatch(closeNotification(index));
  };

  return (
    <>
      {notifications.map((notification, index) => (
        <Banner
          closeIcon
          key={index}
          visible={notification.isVisible}
          variant={notification.variant}
          icon={notification.icon}
          onCloseIconPress={() => handleCloseBanner(index)}
        >
          {notification.text}
        </Banner>
      ))}
    </>
  );
};
