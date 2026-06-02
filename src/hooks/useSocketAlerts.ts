"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";
import type { Alert } from "@/types/alert";

export function useSocketAlerts(onNewAlert: (alert: Alert) => void, onUpdatedAlert?: (alert: Alert) => void) {
  useEffect(() => {
    const socket = io();

    socket.on("alert:new", onNewAlert);
    socket.on("alert:updated", onUpdatedAlert || onNewAlert);

    return () => {
      socket.disconnect();
    };
  }, [onNewAlert, onUpdatedAlert]);
}
