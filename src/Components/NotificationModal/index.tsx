import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import VirtualImg from '../../Assets/_images/hero-section-virtual.png';
import { CrossCircleIcon, NotificationBell } from '../../Assets/svg';
import './notification-modal.scss';
import { useAppDispatch, useAppSelector } from '@/Lib/hooks';
import { notificationsSelector } from '@/Lib/notifications/notifications.selector';
import dayjs from 'dayjs';
import useNotificationSocket from '@/Hooks/useNotificationSocket';
import { authSelector } from '@/Lib/auth/auth.selector';
import { markAllNotificationsRead, updateNotificationsState } from '@/Lib/notifications/notifications.slice';

interface INotification {}

const NotificationModal: React.FC<INotification> = () => {
  const [showDrawer, toggleDrawer] = useState<boolean>(false);
  const { notifications, numUnseen } = useAppSelector(notificationsSelector);
  const { id: userId } = useAppSelector(authSelector);
  const dispatch = useAppDispatch();

  const newSocketNotificationHandler = (data: any) => {
    dispatch(updateNotificationsState(data));
  };

  const { socket } = useNotificationSocket(newSocketNotificationHandler);

  const onToggleDrawer = () => {
    toggleDrawer(!showDrawer);
  };

  const markAllNotificationsAsRead = () => {
    // mark all notifications as read
    socket.emit('notificationSeen', { roomId: `NFTM:${userId}` });
    dispatch(markAllNotificationsRead())
  };

  const renderModal = () => {
    return (
      <div className={`notifications-drawer ${showDrawer ? 'open' : ''}`}>
        <div className="heading">
          <p>Notification</p>
          <span onClick={onToggleDrawer}>
            <CrossCircleIcon />
          </span>
        </div>
        <div className="read-unread-banner">
          {numUnseen > 0 && (
            <div className="unread-count">{`${numUnseen} Unread`}</div>
          )}
          <div
            className="mark-as-read ms-auto"
            onClick={markAllNotificationsAsRead}
          >
            Mark as Read
          </div>
        </div>
        <div className="menu">
          {notifications?.length ? (
            notifications.map((item: any,idx:number) => (
              <div
                className={`menu-item ${
                  item.status === 'read' ? 'read' : 'unread'
                }`}
                key={`notification_${idx}`}
              >
                <div className="d-flex align-items-center gap-2">
                  {/* <div className="noti-img">
                    <Image src={VirtualImg} alt="noti" />
                  </div> */}
                  <div className="noti-message">
                    <div>
                      <span className="title">{item.title}</span>
                      <div className="description">{item.eventMessage}</div>
                    </div>
                    <div className="noti-date">
                      {dayjs(item.createdAt).format('D MMM, YYYY h:mm A')}
                    </div>
                  </div>
                </div>
                {/* <Button
                  isGradient
                  text="View Bid"
                  className="noti-button"
                /> */}
              </div>
            ))
          ) : (
            <div className="no-noti-message">
              <svg
                width="250"
                height="200"
                viewBox="0 0 250 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="250" height="200" fill="white" />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M207 65C210.866 65 214 68.134 214 72C214 75.866 210.866 79 207 79H167C170.866 79 174 82.134 174 86C174 89.866 170.866 93 167 93H189C192.866 93 196 96.134 196 100C196 103.866 192.866 107 189 107H178.826C173.952 107 170 110.134 170 114C170 116.577 172 118.911 176 121C179.866 121 183 124.134 183 128C183 131.866 179.866 135 176 135H93C89.134 135 86 131.866 86 128C86 124.134 89.134 121 93 121H54C50.134 121 47 117.866 47 114C47 110.134 50.134 107 54 107H94C97.866 107 101 103.866 101 100C101 96.134 97.866 93 94 93H69C65.134 93 62 89.866 62 86C62 82.134 65.134 79 69 79H109C105.134 79 102 75.866 102 72C102 68.134 105.134 65 109 65H207ZM207 93C210.866 93 214 96.134 214 100C214 103.866 210.866 107 207 107C203.134 107 200 103.866 200 100C200 96.134 203.134 93 207 93Z"
                  fill="#FFDAAC"
                />
                <path
                  d="M120.5 133C139.002 133 154 118.002 154 99.5C154 80.9985 139.002 66 120.5 66C101.998 66 87 80.9985 87 99.5C87 118.002 101.998 133 120.5 133Z"
                  fill="#F3F7FF"
                  stroke="#333C54"
                  stroke-width="2.5"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M115.132 125.494C116.891 125.819 118.68 125.987 120.5 126C135.136 126 147 114.136 147 99.5C147 84.8645 135.136 73 120.5 73C116.74 73 113.164 73.7829 109.924 75.1946C104.294 77.6479 99.6816 81.9999 96.896 87.4419C95.0445 91.0589 94 95.1575 94 99.5C94 103.44 94.8599 107.179 96.4021 110.54C97.5032 112.94 98.9521 115.146 100.684 117.096"
                  fill="white"
                />
                <path
                  d="M115.132 125.494C116.891 125.819 118.68 125.987 120.5 126C135.136 126 147 114.136 147 99.5C147 84.8645 135.136 73 120.5 73C116.74 73 113.164 73.7829 109.924 75.1946C104.294 77.6479 99.6816 81.9999 96.896 87.4419C95.0445 91.0589 94 95.1575 94 99.5C94 103.44 94.8599 107.179 96.4021 110.54C97.5032 112.94 98.9521 115.146 100.684 117.096"
                  stroke="#333C54"
                  stroke-width="2.5"
                  stroke-linecap="round"
                />
                <path
                  d="M103.797 120.074C105.946 121.82 108.372 123.237 111.001 124.246"
                  stroke="#333C54"
                  stroke-width="2.5"
                  stroke-linecap="round"
                />
                <path
                  d="M148 126L154 132"
                  stroke="#333C54"
                  stroke-width="2.5"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M153.03 131.029C151.138 132.922 151.138 135.99 153.03 137.883L164.116 148.968C166.008 150.861 169.077 150.861 170.97 148.968C172.862 147.076 172.862 144.007 170.97 142.114L159.884 131.029C157.992 129.136 154.923 129.136 153.03 131.029Z"
                  fill="#FFDAAC"
                  fill-opacity="0.38"
                  stroke="#333C54"
                  stroke-width="2.5"
                />
                <path
                  d="M158 133L169 144"
                  stroke="white"
                  stroke-width="2.5"
                  stroke-linecap="round"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M114 88.0005C114 99.5985 123.402 109.001 135 109.001C137.278 109.001 139.472 108.638 141.526 107.967C138.173 116.288 130.023 122.161 120.5 122.161C107.985 122.161 97.8394 112.016 97.8394 99.5005C97.8394 88.1601 106.17 78.7653 117.045 77.1016C115.113 80.2798 114 84.0102 114 88.0005Z"
                  fill="#FFDAAC"
                  fill-opacity="0.38"
                />
                <path
                  d="M121 81C119.727 81 118.482 81.1253 117.279 81.3642M113.645 82.4761C106.804 85.3508 102 92.1144 102 100"
                  stroke="#FE9C14"
                  stroke-width="2.5"
                  stroke-linecap="round"
                />
                <path
                  d="M174.176 99.7773H166M180.5 92H163.324H180.5ZM187.5 92H185.279H187.5Z"
                  stroke="#FE9C14"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M84.1758 121.777H76M79.5 113H62.3242H79.5ZM56.5 113H52.2788H56.5Z"
                  stroke="#FE9C14"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <p>"Nothing to see here! No notifications at the moment."</p>
            </div>
          )}
        </div>
        {/* <hr />
        <div className="view-more">
          <Link
            href="/notifications"
            onClick={onToggleDrawer}
          >
            View All
          </Link>
        </div> */}
      </div>
    );
  };

  return (
    <div className="notification-container">
      <div onClick={onToggleDrawer}>
        <NotificationBell isNewNotification={numUnseen > 0} />
      </div>
      {renderModal()}
    </div>
  );
};

export default NotificationModal;
