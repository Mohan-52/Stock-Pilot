import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client/dist/sockjs.js";
import Stomp from "stompjs";

const SOCKET_URL = "http://localhost:8080/ws-stock";
const STOCK_TOPIC = "/topic/stocks/TOP_50";

export const useLiveStockUpdates = ({ enabled, onStockUpdate }) => {
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const subscriptionsRef = useRef([]);
  const stompClientRef = useRef(null);
  const updateHandlerRef = useRef(onStockUpdate);

  useEffect(() => {
    updateHandlerRef.current = onStockUpdate;
  }, [onStockUpdate]);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    let isActive = true;
    const socket = new SockJS(SOCKET_URL);
    const stompClient = Stomp.over(socket);
    stompClient.reconnect_delay = 5000;
    stompClient.debug = (message) => console.debug("[stocks:stomp]", message);
    stompClientRef.current = stompClient;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConnectionStatus("connecting");
    console.debug("[stocks:ws] Connecting to", SOCKET_URL);

    const handleMessage = (message) => {
      if (!isActive || !message?.body) {
        return;
      }

      console.debug("[stocks:ws] Message received", message.body);

      try {
        const update = JSON.parse(message.body);
        updateHandlerRef.current?.(update);
      } catch (error) {
        console.warn("[stocks:ws] Unable to parse message", error);
      }
    };

    stompClient.connect(
      {},
      () => {
        if (!isActive) {
          return;
        }

        console.debug("[stocks:ws] Connection established");
        setConnectionStatus("connected");

        const subscription = stompClient.subscribe(STOCK_TOPIC, handleMessage);
        subscriptionsRef.current = [subscription];
        console.debug("[stocks:ws] Subscription created", STOCK_TOPIC);
      },
      (frame) => {
        if (!isActive) {
          return;
        }

        console.error("[stocks:ws] Connection error", frame);
        setConnectionStatus("disconnected");
      },
    );

    return () => {
      isActive = false;
      subscriptionsRef.current.forEach((subscription) => {
        if (typeof subscription?.unsubscribe === "function") {
          subscription.unsubscribe();
        }
      });
      subscriptionsRef.current = [];

      if (stompClientRef.current?.connected) {
        stompClientRef.current.disconnect(() => {
          console.debug("[stocks:ws] Disconnected");
        });
      }

      stompClientRef.current = null;
      setConnectionStatus("disconnected");
    };
  }, [enabled]);

  return enabled ? connectionStatus : "disconnected";
};
