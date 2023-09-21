import { Banner } from 'apollo-react-native';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { notificationSelector } from "../../stores/notificationSelectors";
import { closeNotification } from "../../stores/notification";

export const NotificationBanner = () => {
    const dispatch = useDispatch();
    const notification = useSelector(notificationSelector);

    const handleCloseBanner = () => {
        dispatch(closeNotification());
    };

    return (
        <Banner
            closeIcon
            visible={notification.visible}
            variant={notification.variant}
            icon={notification.icon}
            onCloseIconPress={handleCloseBanner}
        >
            {notification.text}
        </Banner>
    );
};
