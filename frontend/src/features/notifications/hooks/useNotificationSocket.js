import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import SockJS from "sockjs-client/dist/sockjs.js";
import Stomp from "stompjs";
import { getAccessToken } from "../../../services/apiClient";
import { useToast } from "../../../components/ToastProvider";
import {
  NOTIFICATIONS_QUERY_KEY,
  UNREAD_NOTIFICATIONS_QUERY_KEY,
} from "./useNotifications";

const SOCKET_URL = "http://localhost:8080/ws-stock";
const NOTIFICATION_DESTINATION = "/user/queue/notifications";

const prependNotification = (current, notification) => {
  if (!current) {
    return {
      content: [notification],
      page: 0,
      size: 1,
      totalElements: 1,
      totalPages: 1,
      last: true,
    };
  }

  if (Array.isArray(current)) {
    return [
      notification,
      ...current.filter((item) => item.id !== notification.id),
    ];
  }

  const content = current.content || [];
  const alreadyExists = content.some((item) => item.id === notification.id);

  return {
    ...current,
    content: [
      notification,
      ...content.filter((item) => item.id !== notification.id),
    ],
    totalElements: alreadyExists
      ? current.totalElements
      : Number(current.totalElements || content.length) + 1,
  };
};

export const useNotificationSocket = (enabled) => {
  const queryClient = useQueryClient();
  const { push: pushToast } = useToast();
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const stompClientRef = useRef(null);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    let isActive = true;
    const socket = new SockJS(SOCKET_URL);
    const stompClient = Stomp.over(socket);
    const token = getAccessToken();
    const connectHeaders = token ? { Authorization: `Bearer ${token}` } : {};

    stompClient.reconnect_delay = 5000;
    stompClient.debug = (message) =>
      console.debug("[notifications:stomp]", message);
    stompClientRef.current = stompClient;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConnectionStatus("connecting");

    const handleMessage = (message) => {
      if (!isActive || !message?.body) {
        return;
      }

      try {
        const notification = JSON.parse(message.body);
        let added = false;

        queryClient.setQueryData(NOTIFICATIONS_QUERY_KEY, (current) => {
          const content = Array.isArray(current)
            ? current
            : current?.content || [];
          added = !content.some((item) => item.id === notification.id);
          return prependNotification(current, notification);
        });

        if (added && !notification.isRead) {
          queryClient.setQueryData(
            UNREAD_NOTIFICATIONS_QUERY_KEY,
            (count = 0) => count + 1,
          );
        }

        pushToast("success", `${notification.title}: ${notification.message}`);
      } catch (error) {
        console.warn("[notifications:ws] Unable to parse message", error);
      }
    };

    stompClient.connect(
      connectHeaders,
      () => {
        if (!isActive) {
          return;
        }

        setConnectionStatus("connected");
        stompClient.subscribe(NOTIFICATION_DESTINATION, handleMessage);
      },
      (frame) => {
        if (!isActive) {
          return;
        }

        console.error("[notifications:ws] Connection error", frame);
        setConnectionStatus("disconnected");
      },
    );

    return () => {
      isActive = false;

      if (stompClientRef.current?.connected) {
        stompClientRef.current.disconnect();
      }

      stompClientRef.current = null;
    };
  }, [enabled, pushToast, queryClient]);

  return enabled ? connectionStatus : "disconnected";
};
