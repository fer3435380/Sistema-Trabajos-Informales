import type { NotificationItem } from "../types/job";

function canUseBrowserNotifications() {
  return typeof window !== "undefined" && "Notification" in window;
}

export function getBrowserNotificationPermission() {
  if (!canUseBrowserNotifications()) {
    return "unsupported";
  }

  return window.Notification.permission;
}

export async function requestBrowserNotificationPermission() {
  if (!canUseBrowserNotifications()) {
    return "unsupported";
  }

  return window.Notification.requestPermission();
}

async function showServiceWorkerNotification(notification: NotificationItem) {
  if (!("serviceWorker" in navigator)) {
    return false;
  }

  const registration = await navigator.serviceWorker.ready;
  const payload = {
    type: "SHOW_NOTIFICATION",
    title: "Sistema de Trabajos Informales",
    body: notification.message,
    tag: notification.dedupe_key ?? `sti-notification-${notification.id}`,
    data: {
      url: "/dashboard",
      notificationId: notification.id,
      applicationId: notification.extra_data?.application_id ?? null,
      jobId: notification.extra_data?.job_id ?? null,
    },
  };

  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage(payload);
    return true;
  }

  await registration.showNotification("Sistema de Trabajos Informales", {
    body: payload.body,
    tag: payload.tag,
    data: payload.data,
  });

  return true;
}

export async function showSystemNotification(notification: NotificationItem) {
  if (!canUseBrowserNotifications()) {
    return;
  }

  if (window.Notification.permission !== "granted") {
    return;
  }

  try {
    const wasShownByServiceWorker = await showServiceWorkerNotification(
      notification,
    );

    if (wasShownByServiceWorker) {
      return;
    }
  } catch {
    // Fallback below when service worker notifications are unavailable.
  }

  new window.Notification("Sistema de Trabajos Informales", {
    body: notification.message,
    tag: notification.dedupe_key ?? `sti-notification-${notification.id}`,
  });
}
