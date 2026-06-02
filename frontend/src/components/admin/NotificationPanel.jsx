import { useState, useRef, useEffect } from 'react';
import { Bell, X, AlertCircle } from 'lucide-react';

const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'order', title: 'New Order', message: 'Order #1024 received', time: '2 minutes ago', unread: true },
  { id: 2, type: 'payment', title: 'Payment Verified', message: 'Payment for Order #1023 confirmed', time: '1 hour ago', unread: true },
  { id: 3, type: 'inventory', title: 'Low Stock Alert', message: 'Foundation XYZ stock below 10 units', time: '3 hours ago', unread: false },
  { id: 4, type: 'review', title: 'New Review', message: 'New 5-star review on Lipstick Pro', time: '5 hours ago', unread: false },
];

export default function NotificationPanel() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const panelRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAsRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getTypeColor = (type) => {
    const colors = {
      order: '#2563eb',
      payment: '#16a34a',
      inventory: '#ca8a04',
      review: '#7c3aed',
    };
    return colors[type] || '#6b7280';
  };

  return (
    <div ref={panelRef} className="notification-panel" style={{ position: 'relative' }}>
      <button
        className="admin-topbar__btn"
        onClick={() => setOpen(!open)}
        aria-label="Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && <span className="admin-notif-dot" />}
      </button>

      {open && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3 className="notification-title">Notifications</h3>
            {unreadCount > 0 && (
              <button className="notification-mark-all" onClick={markAllAsRead}>
                Mark all as read
              </button>
            )}
          </div>

          <div className="notification-list">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`notification-item ${notif.unread ? 'notification-item--unread' : ''}`}
                >
                  <div className="notification-item__icon">
                    <AlertCircle size={14} style={{ color: getTypeColor(notif.type) }} />
                  </div>
                  <div className="notification-item__content" onClick={() => markAsRead(notif.id)}>
                    <div className="notification-item__title">{notif.title}</div>
                    <div className="notification-item__message">{notif.message}</div>
                    <div className="notification-item__time">{notif.time}</div>
                  </div>
                  <button
                    className="notification-item__delete"
                    onClick={() => deleteNotification(notif.id)}
                    aria-label="Delete notification"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))
            ) : (
              <div className="notification-empty">No notifications</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
