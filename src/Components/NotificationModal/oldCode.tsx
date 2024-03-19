import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import VirtualImg from '../../Assets/_images/hero-section-virtual.png'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { NotificationBell } from '../../Assets/svg'
import './notification-modal.scss'

interface INotification {} 

const menuItems = [
  {
    id: 1,
    name: 'john Deo',
    image: VirtualImg,
    reacted: 'reacted to your post',
    date: '10, may 2023 10:50AM',
  },
  {
    id: 2,
    name: 'john Deo',
    image: VirtualImg,
    reacted: 'reacted to your post',
    date: '1 day ago',
  },
  {
    id: 3,
    name: 'john Deo',
    image: VirtualImg,
    reacted: 'reacted to your post',
    date: '1 day ago',
  },
]

const NotificationModal: React.FC<INotification> = () => {
  const renderTooltip = (props: any) => (
    <Tooltip id="button-tooltip" {...props} className="notification-wrapper">
      <div className="heading">Notification</div>
      <hr className="horizontal-rule" />
      <div>
        {menuItems.map((item,idx) => (
          <div key={idx}>
            <div className="menu-item">
              <div className="d-flex align-items-center gap-1">
                <div className="noti-img">
                  <Image src={item.image} alt="noti" />
                </div>
                <div className="name">{item.name}</div>
                <div className="noti-reacted">{item.reacted}</div>
              </div>
              <div className="noti-date">{item.date}</div>
            </div>
            <hr className="horizontal-rule" />
          </div>
        ))}
        <div className="view-all">
          <Link href="/#">View All</Link>
        </div>
      </div>
    </Tooltip>
  )

  return (
    <div className="notification-container">
      <OverlayTrigger
        placement="bottom-end"
        delay={{ show: 250, hide: 400 }}
        trigger="click"
        overlay={renderTooltip}
        rootClose
      >
        <div>
          <NotificationBell />
        </div>
      </OverlayTrigger>
    </div>
  )
}

export default NotificationModal
