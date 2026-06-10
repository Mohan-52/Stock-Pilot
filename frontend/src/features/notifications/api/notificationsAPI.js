import apiClient from "../../../services/apiClient";

export const getNotifications = async () => {
  const response = await apiClient.get("/notifications");
  return response.data;
};

export const getUnreadNotificationCount = async () => {
  const response = await apiClient.get("/notifications/unread-count");
  const data = response.data;

  if (typeof data === "number") {
    return data;
  }

  return Number(data?.count ?? data?.unreadCount ?? 0);
};

export const markNotificationAsRead = async (notificationId) => {
  await apiClient.patch(`/notifications/${notificationId}/read`);
  return notificationId;
};

export const markAllNotificationsAsRead = async () => {
  await apiClient.patch("/notifications/read-all");
};
