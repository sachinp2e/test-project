'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Button from '@/Components/Button';
import useEffectOnce from '../../Hooks/useEffectOnce';
import CustomSelect from '../../Components/CustomSelect/index';
import CustomCheckbox from '../../Components/CustomCheckbox/index';
import { getNotifications } from '../../Lib/notifications/notifications.action';
import { useAppDispatch, useAppSelector } from '../../Lib/hooks';
import LocalSearch from '@/Components/localSearchBar';
import CustomModal from '../../Components/CustomModal';
import { notificationsSelector } from '../../Lib/notifications/notifications.selector';
import { TrashleIcon, TuneDSVG } from '../../Assets/svg';
import CatalogAvatar from '../../Assets/_images/top-catalog-avatar.jpg';
import ConfirmDeleteIcon from '../../Assets/_images/confirm-delete-icon.svg';
import './notificationdetails.scss';

const NotificationsDetail = () => {
  const dispatch = useAppDispatch();
  const { notifications } = useAppSelector(notificationsSelector);

  const [selectedValue, setSelectedValue] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [checkedItems, setCheckedItems] = useState<any>({});
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [isAllDelete, setIsAllDelete] = useState<boolean>(false);

  useEffectOnce(() => {
    dispatch(getNotifications());
  });

  const handleAllDeleteModal = () => {
    setIsAllDelete((pre) => !pre);
  };

  const handleConfirmDelete = () => {
    setIsOpen(false);
    setIsDelete(!isDelete);
  };

  const handleDeleteModal = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectAll = () => {
    setCheckedItems((prevCheckedItems: any) => {
      const allNotifications: any = {};

      notifications?.map((item) => {
        item?.data?.map(
          (notif: any, index: number) =>
            (allNotifications[index + 1] = !prevCheckedItems[index + 1]),
        );
      });

      return allNotifications;
    });
    setIsAllDelete((pre) => !pre);
  };

  const handleCheckboxChange = (itemId: number) => {
    setCheckedItems((prevCheckedItems: any) => ({
      ...prevCheckedItems,
      [itemId]: !prevCheckedItems[itemId],
    }));
  };

  const handleOnchange = (option: any) => {
    setSelectedValue(option.value);
  };

  const DescriptionColor = (description: any) => {
    if (description.includes('3DAbstract')) {
      const parts = description.split('3DAbstract');
      return (
        <>
          {parts[0]}
          <span style={{ color: '#0792F7' }}>3DAbstract</span>
          {parts[1]}
        </>
      );
    } else if (description.includes('3D Abstract')) {
      const parts = description.split('3D Abstract');
      return (
        <>
          {parts[0]}
          <span style={{ color: '#0792F7' }}>3D Abstract</span>
          {parts[1]}
        </>
      );
    } else {
      return description;
    }
  };

  const TitleColor = (title: any) => {
    if (title.includes('Jayesh')) {
      const parts = title.split('Jayesh');
      return (
        <>
          {parts[0]}
          <span style={{ color: '#0792F7' }}>Jayesh </span>
          {parts[1]}
        </>
      );
    } else {
      return title;
    }
  };

  return (
    <>
      <div className="notification-main-wrapper">
        <div className="notification-main-title">Notifications</div>
        <div className="notification-header-wrapper">
          <div className="notification-filter-wrapper">
            <CustomCheckbox
              isChecked={isAllDelete}
              onChange={handleSelectAll}
            />
            <LocalSearch />
            <Button className="tune-btn" element={<TuneDSVG />} />
            <div className="select-btn">
              <CustomSelect
                placeholder="7 Days"
                onChange={(option) => handleOnchange(option)}
                options={[
                  { id: '7 Days', value: '7 Days', label: '7 Days' },
                  { id: '8 Days', value: '8 Days', label: '8 Days' },
                ]}
                name="days"
                value={selectedValue}
              />
            </div>
            <Button
              className="trash-btn"
              onClick={handleAllDeleteModal}
              element={
                <TrashleIcon color={`${isAllDelete ? '#FF1414' : '#999'}`} />
              }
            />
          </div>
          {/* <div className="mark-read-wrapper">Mark as Read</div> */}
        </div>
        <div className="container-wrapper">
          {notifications.map((item, index) => (
            <div className="sub-container-wrapper" key={index}>
              <div className="notification-horizontal-line">
                <div className="show-days">{item.day}</div>
              </div>
              <div className="view-notification-wrapper">
                {item.data.map((viewItem: any) => (
                  <div
                    key={viewItem.id}
                    className={`view-notification-detail ${
                      checkedItems[viewItem.id] ? 'select-item' : null
                    }`}
                    onClick={(e: any) => {
                      if (e.target.tagName === 'INPUT') return;
                      if (
                        e.target.tagName === 'svg' ||
                        e.target.tagName === 'path'
                      )
                        return;
                      handleCheckboxChange(viewItem.id);
                    }}
                  >
                    <div className="notification-message">
                      <div className="sub-notification-message">
                        <div className="notification-checkbox">
                          <CustomCheckbox
                            isChecked={checkedItems[viewItem.id] || false}
                            onChange={() => handleCheckboxChange(viewItem.id)}
                          />
                        </div>

                        <div className="notification-images">
                          <Image
                            src={viewItem.image}
                            className="notification-avatar-img"
                            alt=""
                          />
                          {!!viewItem.view && (
                            <Image
                              className="nested-notification-avatar"
                              src={CatalogAvatar}
                              alt=""
                              width={30}
                              height={30}
                            />
                          )}
                        </div>

                        <div className="notification-main-text-container">
                          <div className="notification-text-header">
                            {TitleColor(viewItem.title)}
                          </div>
                          <div className="notification-text-center">
                            {DescriptionColor(viewItem.detail)}
                          </div>
                          <div className="notification-text-timing">
                            {viewItem.time}
                          </div>
                        </div>
                      </div>
                      <div className="notification-btn-wrapper">
                        <Button
                          isGradient
                          text={viewItem.button}
                          className="notification-btn"
                        />
                        <div className="trash-notification">
                          <Button
                            className="trash-notification-btn"
                            onClick={handleDeleteModal}
                            element={
                              <TrashleIcon
                                color={
                                  checkedItems[viewItem.id]
                                    ? '#FF1414'
                                    : '#656265'
                                }
                              />
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <CustomModal
        show={isOpen}
        onHide={() => setIsOpen(false)}
        element={<Image src={ConfirmDeleteIcon} alt="trash" />}
      >
        <div className="delete-confirmation-modal">
          <div className="heading">
            Do you really want to delete this asset?
          </div>
          <div className="btn-cancle-delete">
            <Button
              className="outlined"
              text="Cancel"
              onClick={() => setIsOpen(false)}
            />
            <Button
              className="filled"
              text="Delete"
              onClick={handleConfirmDelete}
            />
          </div>
        </div>
      </CustomModal>
      <CustomModal show={isDelete} onHide={() => setIsDelete(false)}>
        <div className="delete-details">
          <div className="delete">Deleted Successfully</div>
          <Button
            text="Ok"
            className="filled"
            onClick={() => setIsDelete(false)}
          />
        </div>
      </CustomModal>
    </>
  );
};
export default NotificationsDetail;
