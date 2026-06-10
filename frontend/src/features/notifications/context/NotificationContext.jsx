import { createContext, useContext, useMemo } from "react";
import { useUser } from "../../../contexts/UserContext";
import { getAccessToken } from "../../../services/apiClient";
import {
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
  useNotifications,
  useUnreadNotificationCount,
} from "../hooks/useNotifications";
import { useNotificationSocket } from "../hooks/useNotificationSocket";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { user } = useUser();
  const enabled = Boolean(user && getAccessToken());
  const notificationsQuery = useNotifications(enabled);
  const unreadCountQuery = useUnreadNotificationCount(enabled);
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();
  const connectionStatus = useNotificationSocket(enabled);

  const value = useMemo(
    () => ({
      notifications: Array.isArray(notificationsQuery.data)
        ? notificationsQuery.data
        : notificationsQuery.data?.content || [],
      unreadCount: unreadCountQuery.data || 0,
      isLoading:
        enabled &&
        (notificationsQuery.isLoading || unreadCountQuery.isLoading),
      error: notificationsQuery.error || unreadCountQuery.error,
      connectionStatus,
      markAsRead: markAsRead.mutate,
      markAllAsRead: markAllAsRead.mutate,
      isMarkingAllAsRead: markAllAsRead.isPending,
    }),
    [
      connectionStatus,
      enabled,
      markAllAsRead.isPending,
      markAllAsRead.mutate,
      markAsRead.mutate,
      notificationsQuery.data,
      notificationsQuery.error,
      notificationsQuery.isLoading,
      unreadCountQuery.data,
      unreadCountQuery.error,
      unreadCountQuery.isLoading,
    ],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNotificationContext = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotificationContext must be used within NotificationProvider",
    );
  }

  return context;
};
