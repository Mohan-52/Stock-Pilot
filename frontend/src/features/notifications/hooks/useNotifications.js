import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../api/notificationsAPI";

export const NOTIFICATIONS_QUERY_KEY = ["notifications"];
export const UNREAD_NOTIFICATIONS_QUERY_KEY = ["notifications", "unread-count"];

const updateNotificationContent = (current, update) => {
  if (!current) {
    return current;
  }

  if (Array.isArray(current)) {
    return update(current);
  }

  return {
    ...current,
    content: update(current.content || []),
  };
};

export const useNotifications = (enabled = true) => {
  return useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEY,
    queryFn: getNotifications,
    enabled,
    staleTime: 30_000,
    retry: 1,
  });
};

export const useUnreadNotificationCount = (enabled = true) => {
  return useQuery({
    queryKey: UNREAD_NOTIFICATIONS_QUERY_KEY,
    queryFn: getUnreadNotificationCount,
    enabled,
    staleTime: 30_000,
    retry: 1,
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationAsRead,
    onMutate: async (notificationId) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: NOTIFICATIONS_QUERY_KEY }),
        queryClient.cancelQueries({ queryKey: UNREAD_NOTIFICATIONS_QUERY_KEY }),
      ]);

      const previousNotifications = queryClient.getQueryData(
        NOTIFICATIONS_QUERY_KEY,
      );
      const previousUnreadCount = queryClient.getQueryData(
        UNREAD_NOTIFICATIONS_QUERY_KEY,
      );
      let changed = false;

      queryClient.setQueryData(NOTIFICATIONS_QUERY_KEY, (current) =>
        updateNotificationContent(current, (notifications) =>
          notifications.map((notification) => {
            if (notification.id !== notificationId || notification.isRead) {
              return notification;
            }

            changed = true;
            return { ...notification, isRead: true };
          }),
        ),
      );

      if (changed) {
        queryClient.setQueryData(
          UNREAD_NOTIFICATIONS_QUERY_KEY,
          (count = 0) => Math.max(0, count - 1),
        );
      }

      return { previousNotifications, previousUnreadCount };
    },
    onError: (_error, _notificationId, context) => {
      queryClient.setQueryData(
        NOTIFICATIONS_QUERY_KEY,
        context?.previousNotifications,
      );
      queryClient.setQueryData(
        UNREAD_NOTIFICATIONS_QUERY_KEY,
        context?.previousUnreadCount,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: UNREAD_NOTIFICATIONS_QUERY_KEY,
      });
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onMutate: async () => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: NOTIFICATIONS_QUERY_KEY }),
        queryClient.cancelQueries({ queryKey: UNREAD_NOTIFICATIONS_QUERY_KEY }),
      ]);

      const previousNotifications = queryClient.getQueryData(
        NOTIFICATIONS_QUERY_KEY,
      );
      const previousUnreadCount = queryClient.getQueryData(
        UNREAD_NOTIFICATIONS_QUERY_KEY,
      );

      queryClient.setQueryData(NOTIFICATIONS_QUERY_KEY, (current) =>
        updateNotificationContent(current, (notifications) =>
          notifications.map((notification) => ({
            ...notification,
            isRead: true,
          })),
        ),
      );
      queryClient.setQueryData(UNREAD_NOTIFICATIONS_QUERY_KEY, 0);

      return { previousNotifications, previousUnreadCount };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(
        NOTIFICATIONS_QUERY_KEY,
        context?.previousNotifications,
      );
      queryClient.setQueryData(
        UNREAD_NOTIFICATIONS_QUERY_KEY,
        context?.previousUnreadCount,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: UNREAD_NOTIFICATIONS_QUERY_KEY,
      });
    },
  });
};
