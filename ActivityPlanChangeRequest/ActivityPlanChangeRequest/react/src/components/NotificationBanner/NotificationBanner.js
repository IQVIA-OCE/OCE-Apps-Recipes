import { Banner } from '@oce-apps/apollo-react-native';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { notificationSelector } from '../../store/applicationSlice/applicationSelectors';
import { closeNotification } from '../../store/applicationSlice/applicationSlice';

const NotificationBanner = () => {
  const dispatch = useDispatch();
  const notification = useSelector(notificationSelector);

  return (
    <Banner
      closeIcon
      visible={notification.isVisible}
      variant={notification.variant}
      onCloseIconPress={() => dispatch(closeNotification())}
    >
      {notification.text}
    </Banner>
  );
};

export default NotificationBanner;
