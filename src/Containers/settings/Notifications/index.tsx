import React from 'react';
import ToggleSwitch from '@/Components/ToggleSwitch';
import './style.scss';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/Lib/hooks';
import { notificationsSelector } from '@/Lib/notifications/notifications.selector';
import useEffectOnce from '@/Hooks/useEffectOnce';
import { getAllEmailNotificationsTriggerPoints, updateEmailNotificationsTriggerPoint } from '@/Lib/notifications/notifications.action';
import debounce from 'lodash/debounce';

interface IActivity {
  activityId: string;
  activityName: string;
  activityDescription: string;
  isEnabled: boolean;
}

const NotificationSettings = () => {
  const params = useParams();
  const dispatch = useAppDispatch();
  
  const {
    emailNotifications
  } = useAppSelector(notificationsSelector);

  useEffectOnce(() => {
    if(!emailNotifications.length)
    dispatch(getAllEmailNotificationsTriggerPoints({userId: `${params.userId}`}));
  });

  const handleToggleClick = debounce(async (activity: IActivity) => {
    await dispatch(
      updateEmailNotificationsTriggerPoint({
        userId: `${params.userId}`,
        triggerPointId: activity.activityId,
        isEnabled: !activity.isEnabled,
      }),
    );
  }, 500);
  
  return (
    <div className="notification-settings-page">
      <div className="heading">
        <h3>Manage your email notifications</h3>
        {/* <div className="divider" /> */}
      </div>
      <div className="notifications">
        {
          emailNotifications.map((activity: IActivity) => (
            <>
              <div className="notification-item" key={activity.activityId}>
                <div className="notification-item__left">
                  <p>{activity.activityName}</p>
                  <p>{activity.activityDescription}</p>
                </div>
                <div className="notification-item__right">
                  <ToggleSwitch checked={activity?.isEnabled} onChange={() => handleToggleClick(activity)}/>
                </div>
              </div>
              <div className="divider" />
            </>
          ))
        }
      </div>
    </div>
  );
};

export default NotificationSettings;
